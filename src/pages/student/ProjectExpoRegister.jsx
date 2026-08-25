import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const DOMAINS = [
  "AI & ML", "Data Science & Computing", "Electronics & Embedded Systems", 
  "IoT & Cyber-Physical Systems", "Communication & Signal Processing", 
  "VLSI & Semiconductor Tech", "Robotics & Automation", 
  "Healthcare & Biomedical Tech", "Energy & Sustainable Tech", 
  "Advanced Materials & Nanotech", "Smart Manufacturing", 
  "Smart Campus Solutions", "Environmental & Social Innovation", 
  "Interdisciplinary Technologies", "Open Innovation"
];

const OUTPUT_TYPES = [
  "Hardware prototype", "Software app/platform", "Hardware+software system",
  "Robotics/automation", "AI/ML with demo output", "IoT/cyber-physical system",
  "Validated experimental setup", "Simulation with verified performance"
];

export default function ProjectExpoRegister() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Leader Details (Auto-filled if logged in, manual if guest)
  const [leaderName, setLeaderName] = useState('');
  const [leaderRoll, setLeaderRoll] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');

  const [projectTitle, setProjectTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [outputType, setOutputType] = useState('');
  const [teamSize, setTeamSize] = useState(2);
  const [member2Name, setMember2Name] = useState('');
  const [member2Roll, setMember2Roll] = useState('');
  const [member3Name, setMember3Name] = useState('');
  const [member3Roll, setMember3Roll] = useState('');
  const [facultyMentorName, setFacultyMentorName] = useState('');
  const [facultyMentorEmail, setFacultyMentorEmail] = useState('');
  const [requiresSafetyClearance, setRequiresSafetyClearance] = useState(false);
  const [safetyDetails, setSafetyDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-fill leader details if logged in, and check if already registered
  useEffect(() => {
    if (profile) {
      setLeaderName(profile.full_name || '');
      setLeaderRoll(profile.roll_no || '');
      setLeaderEmail(profile.college_email || profile.email || '');

      supabase
        .from('project_expo_registrations')
        .select('id')
        .eq('leader_id', profile.id)
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            navigate('/dashboard'); // Already registered
          }
        });
    }
  }, [profile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!projectTitle || !domain || !outputType || !member2Name || !member2Roll || !facultyMentorName || !facultyMentorEmail || !leaderName || !leaderRoll || !leaderEmail) {
      setError("Please fill in all required fields.");
      return;
    }
    if (teamSize === 3 && (!member3Name || !member3Roll)) {
      setError("Please provide details for Member 3.");
      return;
    }
    if (requiresSafetyClearance && !safetyDetails) {
      setError("Please provide safety details since your project requires clearance.");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('project_expo_registrations')
        .insert([{
          leader_id: user?.id || null,
          leader_name: leaderName.trim(),
          leader_roll: leaderRoll.trim(),
          leader_email: leaderEmail.trim(),
          project_title: projectTitle.trim(),
          domain: domain,
          output_type: outputType,
          team_size: teamSize,
          member_2_name: member2Name.trim(),
          member_2_roll: member2Roll.trim(),
          member_3_name: teamSize === 3 ? member3Name.trim() : null,
          member_3_roll: teamSize === 3 ? member3Roll.trim() : null,
          faculty_mentor_name: facultyMentorName.trim(),
          faculty_mentor_email: facultyMentorEmail.trim(),
          requires_safety_clearance: requiresSafetyClearance,
          safety_details: requiresSafetyClearance ? safetyDetails.trim() : null
        }]);

      if (insertError) throw insertError;
      
      // Trigger confirmation email
      try {
        if (window.Email) {
          const smtpUser = import.meta.env.VITE_SMTP_USER || '27.kutralingam.xi.b@gmail.com';
          const smtpPass = import.meta.env.VITE_SMTP_PASS || 'ccmdrfqcdibluewc';
          
          const membersHtml = `
            <ul style="color: #444; font-size: 0.95rem;">
              <li><strong>Leader:</strong> ${leaderName.trim()}</li>
              <li><strong>Member 2:</strong> ${member2Name.trim()}</li>
              ${teamSize === 3 && member3Name ? `<li><strong>Member 3:</strong> ${member3Name.trim()}</li>` : ''}
            </ul>
          `;

          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #E3F2FD; padding-bottom: 16px;">
                <h2 style="color: #1E3A8A; margin: 0; font-size: 22px;">Smart Amrita Hackathon 2026</h2>
                <p style="color: #666666; font-size: 0.95rem; margin-top: 6px; font-weight: 600;">Project Expo Registration Confirmed</p>
              </div>
              
              <p style="font-size: 1rem; color: #333333; line-height: 1.5;">Dear <strong>${leaderName.trim()}</strong>,</p>
              <p style="font-size: 0.95rem; color: #333333; line-height: 1.5;">
                Congratulations! Your team's project has been successfully registered for the SAH 2026 Project Expo. Below are your registration details:
              </p>

              <div style="background-color: #F8FAFC; padding: 16px; border-radius: 8px; border-left: 4px solid #1E3A8A; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Project Title:</strong> <span style="color: #1E3A8A;">${projectTitle.trim()}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Domain:</strong> ${domain}</p>
                <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong>Faculty Mentor:</strong> ${facultyMentorName.trim()}</p>
                
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

          await window.Email.send({
            Host: "smtp.gmail.com",
            Username: smtpUser,
            Password: smtpPass,
            To: leaderEmail.trim(),
            From: smtpUser,
            Subject: 'SAH 2026 Project Expo - Registration Confirmed!',
            Body: emailHtml
          });
        }
      } catch (mailErr) {
        console.error("Failed to send confirmation mail:", mailErr);
      }
      
      setSuccess(true);
      setTimeout(() => {
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/events/project-expo');
        }
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container" style={{ maxWidth: '640px', margin: '0 auto', padding: '30px', textAlign: 'center' }}>
        <div className="card">
          <h2 style={{ color: 'var(--green)', marginBottom: '16px' }}>Registration Successful!</h2>
          <p>Your project has been officially submitted for the Project Expo 2026. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '640px', margin: '0 auto', padding: '30px' }}>
      <div className="page-header">
        <h1 className="page-title">Project Expo Registration</h1>
        <p className="page-subtitle">Register your team and project details. <strong>Note: Only the Team Leader needs to apply for the event on behalf of the entire team.</strong> You will automatically be set as the Team Leader.</p>
      </div>

      <div className="card">
        {error && (
          <div style={{
            background: '#FFEBEE', color: 'var(--red)',
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem', marginBottom: '16px'
          }}>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <h3 style={{ marginBottom: '16px', color: 'var(--navy-primary)' }}>Leader Details (Member 1)</h3>
          
          {user ? (
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--blue)', marginBottom: '24px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Your details are automatically linked from your SAH Portal account.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem' }}>
                <div><strong>Name:</strong> {leaderName}</div>
                <div><strong>Roll No:</strong> {leaderRoll}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Email:</strong> {leaderEmail}</div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input type="text" className="form-input" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number <span className="required">*</span></label>
                <input type="text" className="form-input" value={leaderRoll} onChange={(e) => setLeaderRoll(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">College Mail ID <span className="required">*</span></label>
                <input type="email" className="form-input" value={leaderEmail} onChange={(e) => setLeaderEmail(e.target.value)} required />
              </div>
            </div>
          )}

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E2E8F0' }} />

          <h3 style={{ marginBottom: '16px', color: 'var(--navy-primary)' }}>Project Details</h3>

          <div className="form-group">
            <label className="form-label">Project Title <span className="required">*</span></label>
            <input 
              type="text" 
              className="form-input" 
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter a descriptive title for your project"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Domain <span className="required">*</span></label>
            <select 
              className="form-select" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            >
              <option value="">Select Domain...</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Output Type <span className="required">*</span></label>
            <select 
              className="form-select" 
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
              required
            >
              <option value="">Select Output Type...</option>
              {OUTPUT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Total Team Size <span className="required">*</span></label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" name="teamSize" value={2} checked={teamSize === 2} onChange={() => setTeamSize(2)} /> 2 Members
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" name="teamSize" value={3} checked={teamSize === 3} onChange={() => setTeamSize(3)} /> 3 Members
              </label>
            </div>
            <div className="form-hint">You are Member 1 (Team Leader).</div>
          </div>

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E2E8F0' }} />

          <h3 style={{ marginBottom: '16px', color: 'var(--navy-primary)' }}>Team Members</h3>

          <div className="form-group">
            <label className="form-label">Member 2: Full Name <span className="required">*</span></label>
            <input type="text" className="form-input" value={member2Name} onChange={(e) => setMember2Name(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Member 2: Roll Number <span className="required">*</span></label>
            <input type="text" className="form-input" value={member2Roll} onChange={(e) => setMember2Roll(e.target.value)} required />
          </div>

          {teamSize === 3 && (
            <>
              <div className="form-group">
                <label className="form-label">Member 3: Full Name <span className="required">*</span></label>
                <input type="text" className="form-input" value={member3Name} onChange={(e) => setMember3Name(e.target.value)} required={teamSize === 3} />
              </div>
              <div className="form-group">
                <label className="form-label">Member 3: Roll Number <span className="required">*</span></label>
                <input type="text" className="form-input" value={member3Roll} onChange={(e) => setMember3Roll(e.target.value)} required={teamSize === 3} />
              </div>
            </>
          )}

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E2E8F0' }} />

          <div className="form-group">
            <label className="form-label">Faculty Mentor Name <span className="required">*</span></label>
            <input type="text" className="form-input" value={facultyMentorName} onChange={(e) => setFacultyMentorName(e.target.value)} placeholder="e.g. Dr. Jane Doe" required />
          </div>
          <div className="form-group">
            <label className="form-label">Faculty Mentor Email <span className="required">*</span></label>
            <input type="email" className="form-input" value={facultyMentorEmail} onChange={(e) => setFacultyMentorEmail(e.target.value)} required />
          </div>

          <div className="form-group" style={{ background: '#FEF2F2', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--red)', marginTop: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={requiresSafetyClearance}
                onChange={(e) => setRequiresSafetyClearance(e.target.checked)}
                style={{ marginTop: '4px' }}
              />
              <span style={{ color: 'var(--red)', fontWeight: 500, fontSize: '0.9rem' }}>
                My project involves high voltage, batteries, motors, lasers, chemicals, bio-materials, pressurised systems, heat, rotating machinery, or sharp components.
              </span>
            </label>

            {requiresSafetyClearance && (
              <div style={{ marginTop: '16px' }}>
                <label className="form-label">Safety Hazards & Precautions <span className="required">*</span></label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={safetyDetails}
                  onChange={(e) => setSafetyDetails(e.target.value)}
                  placeholder="Describe the specific hazards and your safety precautions..."
                  required={requiresSafetyClearance}
                ></textarea>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-orange btn-lg w-full" 
            style={{ marginTop: '32px' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Complete Registration'}
          </button>

        </form>
      </div>
    </div>
  );
}
