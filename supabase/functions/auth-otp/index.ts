import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};
const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });
const normalizeEmail = (value: unknown) => typeof value === "string" ? value.trim().toLowerCase() : "";
const otpHash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))).map(byte => byte.toString(16).padStart(2, "0")).join("");

async function sendOtp(to: string, otp: string, heading: string, smtpUser: string, smtpPass: string, smtpHost: string) {
  const transporter = nodemailer.createTransport({ host: smtpHost, port: 587, secure: false, auth: { user: smtpUser, pass: smtpPass } });
  await transporter.sendMail({
    from: `"SAH 2026" <${smtpUser}>`, to,
    subject: `SAH 2026 Portal - ${heading}`,
    text: `${heading}. Your verification code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    const action = body.action;
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    if (!supabaseUrl || !serviceRole || !smtpUser || !smtpPass) return json({ error: "Server mail configuration is incomplete" }, 500);
    const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
    const inputEmail = normalizeEmail(body.email);

    if (action === "request-registration") {
      if (!inputEmail || !body.formData || typeof body.formData !== "object") return json({ error: "Invalid registration request" }, 400);
      const { data: recent } = await admin.from("auth_otp_challenges").select("id").eq("purpose", "registration").eq("email", inputEmail).gt("created_at", new Date(Date.now() - 60_000).toISOString()).limit(1);
      if (recent?.length) return json({ error: "Please wait one minute before requesting another code" }, 429);
      const { data: existing } = await admin.from("profiles").select("id").or(`email.eq.${inputEmail},college_email.eq.${inputEmail}`).limit(1);
      if (existing?.length) return json({ error: "An account already exists for this email" }, 409);
      const otp = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6).padStart(6, "0");
      const formData = { ...body.formData }; delete formData.password; delete formData.confirmPassword;
      await admin.from("auth_otp_challenges").update({ consumed_at: new Date().toISOString() }).eq("purpose", "registration").eq("email", inputEmail).is("consumed_at", null);
      const { error } = await admin.from("auth_otp_challenges").insert({ purpose: "registration", email: inputEmail, otp_hash: await otpHash(otp), payload: formData, expires_at: new Date(Date.now() + 600000).toISOString() });
      if (error) throw error;
      await sendOtp(inputEmail, otp, "Registration verification", smtpUser, smtpPass, smtpHost);
      return json({ ok: true });
    }

    if (action === "request-password-reset") {
      if (!inputEmail) return json({ ok: true }); // non-enumerating response
      const { data: recent } = await admin.from("auth_otp_challenges").select("id").eq("purpose", "password_reset").eq("email", inputEmail).gt("created_at", new Date(Date.now() - 60_000).toISOString()).limit(1);
      if (recent?.length) return json({ ok: true });
      const { data: profile } = await admin.from("profiles").select("email, college_email").or(`email.eq.${inputEmail},college_email.eq.${inputEmail}`).maybeSingle();
      if (!profile) return json({ ok: true });
      const destination = normalizeEmail(profile.college_email) || normalizeEmail(profile.email);
      const otp = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6).padStart(6, "0");
      await admin.from("auth_otp_challenges").update({ consumed_at: new Date().toISOString() }).eq("purpose", "password_reset").eq("email", inputEmail).is("consumed_at", null);
      const { error } = await admin.from("auth_otp_challenges").insert({ purpose: "password_reset", email: inputEmail, otp_hash: await otpHash(otp), expires_at: new Date(Date.now() + 600000).toISOString() });
      if (error) throw error;
      await sendOtp(destination, otp, "Password reset", smtpUser, smtpPass, smtpHost);
      return json({ ok: true });
    }

    if (action === "complete-password-reset") {
      const otp = typeof body.otp === "string" ? body.otp.trim() : "";
      const password = typeof body.newPassword === "string" ? body.newPassword : "";
      if (!inputEmail || !/^\d{6}$/.test(otp) || password.length < 8) return json({ error: "Invalid or expired verification code" }, 400);
      const { data: challenge } = await admin.from("auth_otp_challenges").select("id, otp_hash").eq("purpose", "password_reset").eq("email", inputEmail).is("consumed_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!challenge || challenge.otp_hash !== await otpHash(otp)) return json({ error: "Invalid or expired verification code" }, 400);
      const { data: profile } = await admin.from("profiles").select("id").or(`email.eq.${inputEmail},college_email.eq.${inputEmail}`).maybeSingle();
      if (!profile) return json({ error: "Invalid or expired verification code" }, 400);
      const { error } = await admin.auth.admin.updateUserById(profile.id, { password });
      if (error) throw error;
      await admin.from("auth_otp_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", challenge.id);
      return json({ ok: true });
    }

    if (action === "complete-registration") {
      const otp = typeof body.otp === "string" ? body.otp.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      if (!inputEmail || !/^\d{6}$/.test(otp) || password.length < 8) return json({ error: "Invalid or expired verification code" }, 400);
      const { data: challenge } = await admin.from("auth_otp_challenges").select("id, otp_hash, payload").eq("purpose", "registration").eq("email", inputEmail).is("consumed_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!challenge || challenge.otp_hash !== await otpHash(otp)) return json({ error: "Invalid or expired verification code" }, 400);
      const payload = (challenge.payload && typeof challenge.payload === "object" ? challenge.payload : {}) as Record<string, unknown>;
      const primaryEmail = normalizeEmail(payload.email);
      if (!primaryEmail) return json({ error: "Registration data is incomplete" }, 400);
      const metadata = {
        full_name: typeof payload.fullName === "string" ? payload.fullName.trim() : "",
        roll_no: typeof payload.rollNo === "string" ? payload.rollNo.trim().toUpperCase() : null,
        college_email: inputEmail,
        gender: payload.gender || "Other",
        department: payload.department || "",
        skills: Array.isArray(payload.skills) ? payload.skills : [],
        phone: typeof payload.phone === "string" ? payload.phone.trim() : null,
        year_of_study: payload.yearOfStudy || null,
        github_url: typeof payload.githubUrl === "string" ? payload.githubUrl.trim() : null,
        linkedin_url: typeof payload.linkedinUrl === "string" ? payload.linkedinUrl.trim() : null,
      };
      const { data: created, error } = await admin.auth.admin.createUser({ email: primaryEmail, password, email_confirm: true, user_metadata: metadata });
      if (error) return json({ error: error.message }, 409);
      await admin.from("auth_otp_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", challenge.id);
      return json({ ok: true, userId: created.user.id });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("auth-otp failure", error);
    return json({ error: "Unable to complete this request" }, 500);
  }
});
