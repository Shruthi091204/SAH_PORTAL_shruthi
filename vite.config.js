import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'
import path from 'path'

// ... existing code ...
function otpEmailPlugin() {
  return {
    name: 'otp-email-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const { email, otpCode, type } = JSON.parse(body || '{}');

              if (!email || !otpCode) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Email and OTP code are required.' }));
                return;
              }

              const smtpUser = process.env.SMTP_USER || process.env.VITE_SMTP_USER || '27.kutralingam.xi.b@gmail.com';
              const smtpPass = process.env.SMTP_PASS || process.env.VITE_SMTP_PASS || 'ccmdrfqcdibluewc';

              const isRegistration = type === 'registration';

              const subject = isRegistration
                ? 'SAH 2026 Portal - Student Registration Verification Code'
                : 'SAH 2026 Portal - Password Reset Security OTP';

              const title = isRegistration
                ? 'Student Registration Verification'
                : 'Password Reset Request';

              const introText = isRegistration
                ? 'Thank you for registering for SAH 2026! Please use the following 6-digit OTP code to verify your College Mail ID and complete your student registration:'
                : 'We received a request to reset your password. Your 6-digit OTP security code is:';

              const footerText = isRegistration
                ? 'This code is valid for 10 minutes. If you did not initiate registration on the SAH Portal, please ignore this email.'
                : 'This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.';

              const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                  user: smtpUser,
                  pass: smtpPass
                }
              });

              await transporter.sendMail({
                from: `"SAH Admin" <${smtpUser}>`,
                to: email,
                subject,
                html: `
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
                `
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'OTP sent successfully.' }));
            } catch (err) {
              console.error('OTP Send Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to send OTP email.' }));
            }
          });
        } else if (req.url === '/api/send-expo-mail' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const { 
                leaderName, leaderEmail, projectTitle, domain, 
                teamSize, member2Name, member3Name, mentorName 
              } = JSON.parse(body || '{}');

              if (!leaderEmail || !leaderName) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Leader Name and Email are required.' }));
                return;
              }

              const smtpUser = process.env.SMTP_USER || process.env.VITE_SMTP_USER || '27.kutralingam.xi.b@gmail.com';
              const smtpPass = process.env.SMTP_PASS || process.env.VITE_SMTP_PASS || 'ccmdrfqcdibluewc';

              const subject = 'SAH 2026 Project Expo - Registration Confirmed!';

              const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                  user: smtpUser,
                  pass: smtpPass
                }
              });

              const membersHtml = `
                <ul style="color: #444; font-size: 0.95rem;">
                  <li><strong>Leader:</strong> ${leaderName}</li>
                  <li><strong>Member 2:</strong> ${member2Name}</li>
                  ${teamSize === 3 && member3Name ? `<li><strong>Member 3:</strong> ${member3Name}</li>` : ''}
                </ul>
              `;

              await transporter.sendMail({
                from: `"SAH Admin" <${smtpUser}>`,
                to: leaderEmail,
                subject,
                html: `
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
                `
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Expo Email sent successfully.' }));
            } catch (err) {
              console.error('Expo Mail Send Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to send expo email.' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), otpEmailPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
