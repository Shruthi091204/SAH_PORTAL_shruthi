import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const TRACKS = [
  "T1: Smart Manufacturing and Industry 5.0", 
  "T2: Robotics, Drones and Autonomous Systems",
  "T3: AI and Applied Machine Learning", 
  "T4: Data Science, Analytics and Decision Intelligence", 
  "T5: Cyber Security, Privacy and Trusted Computing", 
  "T6: Next-Generation Communication, IoT and Embedded Systems", 
  "T7: Energy, Sustainability and Climate Action", 
  "T8: Healthcare, Biomedical and Assistive Technology", 
  "T9: Smart Infrastructure, Mobility and Transportation", 
  "T10: Social Innovation, Inclusive and Educational Technology"
];

export default function PosterPresentationRegister() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Author Details
  const [authorName, setAuthorName] = useState('');
  const [authorRoll, setAuthorRoll] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  // Poster Details
  const [posterTitle, setPosterTitle] = useState('');
  const [track, setTrack] = useState('');
  
  // Mentor Details
  const [facultyMentorName, setFacultyMentorName] = useState('');
  const [facultyMentorEmail, setFacultyMentorEmail] = useState('');
  
  // Integrity
  const [agreeIntegrity, setAgreeIntegrity] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-fill author details if logged in
  useEffect(() => {
    if (profile) {
      setAuthorName(profile.full_name || '');
      setAuthorRoll(profile.roll_no || '');
      setAuthorEmail(profile.college_email || profile.email || '');

      supabase
        .from('poster_presentations')
        .select('id')
        .eq('author_id', profile.id)
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            navigate('/dashboard'); // Already registered
          }
        });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!posterTitle || !track || !facultyMentorName || !facultyMentorEmail || !authorName || !authorRoll || !authorEmail) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agreeIntegrity) {
      setError("You must agree to the academic integrity declaration.");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('poster_presentations')
        .insert([{
          author_id: user?.id || null,
          author_name: authorName.trim(),
          author_roll: authorRoll.trim(),
          author_email: authorEmail.trim(),
          poster_title: posterTitle.trim(),
          track: track,
          faculty_mentor_name: facultyMentorName.trim(),
          faculty_mentor_email: facultyMentorEmail.trim(),
          agree_integrity: agreeIntegrity
        }]);

      if (insertError) throw insertError;
      
      // Trigger confirmation email
      try {
        const { data: resData, error: invokeErr } = await supabase.functions.invoke('send-email', {
          body: {
            type: 'poster',
            email: authorEmail.trim(), // explicitly pass 'email' for the edge function
            authorName: authorName.trim(),
            authorEmail: authorEmail.trim(),
            posterTitle: posterTitle.trim(),
            track: track,
            mentorName: facultyMentorName.trim()
          }
        });
        if (invokeErr || (resData && resData.error)) {
          console.warn("Edge function mail warning:", invokeErr || resData?.error);
        }
      } catch (mailErr) {
        console.error("Failed to send confirmation mail:", mailErr);
        // We don't throw here because registration was still successful
      }

      // Save details locally to prefill SAH Hackathon registration if they decide to register later
      if (!user) {
        localStorage.setItem('sah_prefill', JSON.stringify({
          fullName: authorName.trim(),
          rollNo: authorRoll.trim(),
          collegeEmail: authorEmail.trim()
        }));
      }

      setSuccess(true);
      setTimeout(() => {
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/events/poster-presentation');
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
          <p>Your poster has been officially submitted for the SAH 2026 Poster Presentation. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '640px', margin: '0 auto', padding: '30px' }}>
      <div className="page-header">
        <h1 className="page-title">Poster Presentation Registration</h1>
        <p className="page-subtitle">Register your poster details. <strong>Note: Posters carry a single author. There are no teams in this category.</strong></p>
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
          
          <h3 style={{ marginBottom: '16px', color: 'var(--navy-primary)' }}>Author Details</h3>
          
          {user ? (
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--blue)', marginBottom: '24px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Your details are automatically linked from your SAH Portal account.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem' }}>
                <div><strong>Name:</strong> {authorName}</div>
                <div><strong>Roll No:</strong> {authorRoll}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Email:</strong> {authorEmail}</div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input type="text" className="form-input" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number <span className="required">*</span></label>
                <input type="text" className="form-input" value={authorRoll} onChange={(e) => setAuthorRoll(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">College Mail ID <span className="required">*</span></label>
                <input type="email" className="form-input" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} required />
              </div>
            </div>
          )}

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E2E8F0' }} />

          <h3 style={{ marginBottom: '16px', color: 'var(--navy-primary)' }}>Poster Details</h3>

          <div className="form-group">
            <label className="form-label">Poster Title <span className="required">*</span></label>
            <input 
              type="text" 
              className="form-input" 
              value={posterTitle}
              onChange={(e) => setPosterTitle(e.target.value)}
              placeholder="Enter the title of your poster/research"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thematic Track <span className="required">*</span></label>
            <select 
              className="form-select" 
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              required
            >
              <option value="">Select Track...</option>
              {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="form-hint" style={{ marginTop: '8px' }}>Placement follows the subject of the work rather than the department of the author.</div>
          </div>

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E2E8F0' }} />

          <h3 style={{ marginBottom: '16px', color: 'var(--navy-primary)' }}>Faculty Mentor / Guide</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Mandatory. A faculty mentor or research guide must endorse the entry.</p>

          <div className="form-group">
            <label className="form-label">Mentor Name <span className="required">*</span></label>
            <input type="text" className="form-input" value={facultyMentorName} onChange={(e) => setFacultyMentorName(e.target.value)} placeholder="e.g. Dr. Jane Doe" required />
          </div>
          <div className="form-group">
            <label className="form-label">Mentor Email <span className="required">*</span></label>
            <input type="email" className="form-input" value={facultyMentorEmail} onChange={(e) => setFacultyMentorEmail(e.target.value)} required />
          </div>

          <div className="form-group" style={{ background: '#F0FDF4', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #16A34A', marginTop: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={agreeIntegrity}
                onChange={(e) => setAgreeIntegrity(e.target.checked)}
                style={{ marginTop: '4px' }}
                required
              />
              <span style={{ color: '#166534', fontWeight: 500, fontSize: '0.9rem' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <ShieldCheck size={16} /> Academic Integrity Declaration
                </strong>
                I certify that this poster is my original work. I have acknowledged external resources, cited methods/datasets used, and have not fabricated results. I understand that misrepresentation will lead to disqualification.
              </span>
            </label>
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
