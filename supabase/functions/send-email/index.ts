// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import nodemailer from "npm:nodemailer"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const {
      type, email,
      leaderName, leaderEmail, projectTitle, domain, teamSize, member2Name, member3Name, mentorName,
      authorName, authorEmail, posterTitle, track,
      formData, targetEmail, primaryAuthEmail
    } = body

    let otpCode = body.otpCode || '';
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if ((type === 'registration' || type === 'password_reset') && supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      
      if (type === 'registration') {
        await supabase.from('registration_otps').insert({
          college_email: email,
          otp_code: otpCode,
          form_data: formData,
          expires_at: expiresAt
        });
      } else if (type === 'password_reset') {
        const resetsToInsert = [
          { email: targetEmail, otp_code: otpCode, expires_at: expiresAt }
        ];
        if (primaryAuthEmail && targetEmail !== primaryAuthEmail) {
          resetsToInsert.push({ email: primaryAuthEmail, otp_code: otpCode, expires_at: expiresAt });
        }
        await supabase.from('password_resets').insert(resetsToInsert);
      }
    }

    // Use Supabase Secrets for SMTP credentials
    const smtpUser = Deno.env.get('SMTP_USER') || '27.kutralingam.xi.b@gmail.com';
    const smtpPass = Deno.env.get('SMTP_PASS') || 'nxskrnmgtszehjox';
    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    let subject = '';
    let htmlContent = '';
    const recipientEmail = type === 'expo' ? leaderEmail : (type === 'poster' ? authorEmail : (targetEmail || email));

    if (type === 'registration' || type === 'password_reset') {
      const isRegistration = type === 'registration';
      subject = isRegistration
        ? 'SAH 2026 Portal - Student Registration Verification Code'
        : 'SAH 2026 Portal - Password Reset Security OTP';
      const title = isRegistration ? 'Student Registration Verification' : 'Password Reset Request';
      const introText = isRegistration
        ? 'Thank you for registering for SAH 2026! Please use the following 6-digit OTP code to verify your College Mail ID and complete your student registration:'
        : 'We received a request to reset your password. Your 6-digit OTP security code is:';
      const footerText = isRegistration
        ? 'This code is valid for 10 minutes. If you did not initiate registration on the SAH Portal, please ignore this email.'
        : 'This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.';

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #FFF3E0; padding-bottom: 16px;">
            <h2 style="color: #E65100; margin: 0; font-size: 22px;">Smart Amrita Hackathon 2026</h2>
            <p style="color: #666666; font-size: 0.95rem; margin-top: 6px; font-weight: 600;">${title}</p>
          </div>
          <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">${introText}</p>
          <div style="text-align: center; margin: 24px 0; padding: 18px; background-color: #FFF3E0; border-radius: 8px; border: 1px dashed #FF9800;">
            <span style="font-size: 38px; font-weight: bold; letter-spacing: 10px; color: #E65100; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="font-size: 0.85rem; color: #777777; line-height: 1.4;">${footerText}</p>
        </div>
      `;
    } else if (type === 'expo') {
      subject = 'SAH 2026 Project Expo - Registration Confirmed!';
      const membersHtml = `
        <ul style="color: #444; font-size: 0.95rem;">
          <li><strong>Leader:</strong> ${leaderName}</li>
          <li><strong>Member 2:</strong> ${member2Name}</li>
          ${teamSize === 3 && member3Name ? `<li><strong>Member 3:</strong> ${member3Name}</li>` : ''}
        </ul>
      `;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #E3F2FD; padding-bottom: 16px;">
            <h2 style="color: #1E3A8A; margin: 0; font-size: 22px;">Smart Amrita Hackathon 2026</h2>
            <p style="color: #666666; font-size: 0.95rem; margin-top: 6px; font-weight: 600;">Project Expo Registration Confirmed</p>
          </div>
          
          <p style="font-size: 1rem; color: #333333; line-height: 1.5;">Dear <strong>${leaderName}</strong>,</p>
          <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">
            Congratulations! Your team's project has been successfully registered for the SAH 2026 Project Expo. Below are your registration details:
          </p>

          <div style="background-color: #F8FAFC; padding: 16px; border-radius: 8px; border-left: 4px solid #1E3A8A; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Project Title:</strong> <span style="color: #1E3A8A;">${projectTitle}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Domain:</strong> ${domain}</p>
            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Faculty Mentor:</strong> ${mentorName}</p>
            
            <p style="margin: 12px 0 4px 0; font-size: 0.95rem; font-weight: bold;">Team Members (${teamSize}):</p>
            ${membersHtml}
          </div>

          <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">
            Please ensure you have all materials ready before the expo day. If you need any assistance, reach out to your faculty mentor or the SAH organizing committee.
          </p>

          <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 0.85rem; color: #777777; line-height: 1.4;">Thank you for innovating with us!<br/>- SAH 2026 Organizing Committee</p>
          </div>
        </div>
      `;
    } else if (type === 'poster') {
      subject = 'SAH 2026 Poster Presentation - Registration Confirmed!';

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #E3F2FD; padding-bottom: 16px;">
            <h2 style="color: #1E3A8A; margin: 0; font-size: 22px;">Smart Amrita Hackathon 2026</h2>
            <p style="color: #666666; font-size: 0.95rem; margin-top: 6px; font-weight: 600;">Poster Presentation Registration Confirmed</p>
          </div>
          
          <p style="font-size: 1rem; color: #333333; line-height: 1.5;">Dear <strong>${authorName}</strong>,</p>
          <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">
            Congratulations! Your poster has been successfully registered for the SAH 2026 Poster Presentation event. Below are your registration details:
          </p>

          <div style="background-color: #F8FAFC; padding: 16px; border-radius: 8px; border-left: 4px solid #1E3A8A; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Poster Title:</strong> <span style="color: #1E3A8A;">${posterTitle}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Thematic Track:</strong> ${track}</p>
            <p style="margin: 0 0 0 0; font-size: 0.95rem;"><strong>Faculty Mentor:</strong> ${mentorName}</p>
          </div>

          <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">
            Please ensure your poster meets the A0 specification guidelines and is ready before the presentation day. If you need any assistance, reach out to your faculty mentor or the SAH organizing committee.
          </p>

          <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 0.85rem; color: #777777; line-height: 1.4;">Thank you for contributing to research and innovation!<br/>- SAH 2026 Organizing Committee</p>
          </div>
        </div>
      `;
    } else {
      subject = 'SAH 2026 Portal - Registration Successful!';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #E3F2FD; padding-bottom: 16px;">
            <h2 style="color: #1E3A8A; margin: 0; font-size: 22px;">Smart Amrita Hackathon 2026</h2>
            <p style="color: #666666; font-size: 0.95rem; margin-top: 6px; font-weight: 600;">Registration Successful</p>
          </div>
          
          <p style="font-size: 1rem; color: #333333; line-height: 1.5;">Hello,</p>
          <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">
            Congratulations! Your registration for the SAH 2026 Portal was successful.
          </p>

          <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">
            You can now log in using your registered email address to access your dashboard, form teams, and register for events.
          </p>

          <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 0.85rem; color: #777777; line-height: 1.4;">Welcome aboard!<br/>- SAH 2026 Organizing Committee</p>
          </div>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"SAH Admin" <${smtpUser}>`,
      to: recipientEmail,
      subject,
      html: htmlContent
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    )
  }
})
