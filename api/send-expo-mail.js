import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { 
      leaderName, 
      leaderEmail, 
      projectTitle, 
      domain, 
      teamSize,
      member2Name,
      member3Name,
      mentorName
    } = body;

    if (!leaderEmail || !leaderName) {
      return res.status(400).json({ error: 'Leader Name and Email are required.' });
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

    return res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Vercel Expo Mail Send Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to send confirmation email.' });
  }
}
