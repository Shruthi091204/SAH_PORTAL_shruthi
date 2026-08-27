export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Smart Amrita Hackathon 2026</h4>
          <p>
            Internal SIH by Amrita Vishwa Vidyapeetham, Chennai Campus
            (Amrita School of Engineering and Computing) to nominate teams for Smart India Hackathon 2026.
          </p>
          <p style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.7 }}>
            Organized by The Organising Committee, SAH 2026 & Campus SPOC
          </p>
        </div>

        <div className="footer-section">
          <h4>Important Key Dates</h4>
          <p> Curtain Raiser & Reg Opens: <strong>Mon, 24 Aug 2026</strong></p>
          <p> Registration Deadline: <strong>Sat, 5 Sep 2026 (5 PM)</strong></p>
          <p> SAH 2026 Live Pitch & Demo: <strong>Thu, 10 Sep 2026</strong></p>
          <p> Nomination Announcement: <strong>Fri, 11 Sep 2026</strong></p>
          <p> Intensive Mentorship Bootcamp: <strong>15th – 19th Sep 2026</strong></p>
          <p> SIH Portal Upload: <strong>Sun, 20 Sep 2026 (5 PM)</strong></p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <p><a href="https://sih.gov.in" target="_blank" rel="noreferrer">Official SIH Portal (sih.gov.in) →</a></p>
          <p><a href="https://www.amrita.edu/campus/chennai/" target="_blank" rel="noreferrer">Amrita Chennai Campus →</a></p>
          <p><a href="/themes">Browse Problem Statements & Themes →</a></p>
          <p><a href="/marketplace">Student Recruitment Marketplace →</a></p>
        </div>

        <div className="footer-section">
          <h4>Contact & Helpdesk</h4>
          <p>Amrita School of Engineering</p>
          <p>Amrita Vishwa Vidyapeetham, Chennai Campus</p>
          <p>Vengal, Thiruvallur District, Tamil Nadu</p>
          <p style={{ marginTop: '8px' }}>
             sah@ch.amrita.edu
          </p>
          <div style={{ marginTop: '12px', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <strong>Student Contacts:</strong><br />
            Kutralingam: 6382725104<br />
            <a href="mailto:27.kutralingam.xi.b@gmail.com" style={{color: 'var(--orange)'}}>27.kutralingam.xi.b@gmail.com</a><br /><br />
            Vishnu Kamesh: 736250061<br />
            <a href="mailto:kothapallilalithavishnukamesh@gmail.com" style={{color: 'var(--orange)'}}>kothapallilalithavishnukamesh@gmail.com</a><br /><br />
            Shruthika: 9074383050<br />
            <a href="mailto:shruthika.rajan@gmail.com" style={{color: 'var(--orange)'}}>shruthika.rajan@gmail.com</a><br /><br />
            Vishal: 8951313335<br />
            <a href="mailto:vishal.pr2004@gmail.com" style={{color: 'var(--orange)'}}>vishal.pr2004@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
         2026 Smart Amrita Hackathon (SAH 2026) — Amrita Vishwa Vidyapeetham, Chennai Campus. All rights reserved.
      </div>
    </footer>
  );
}
