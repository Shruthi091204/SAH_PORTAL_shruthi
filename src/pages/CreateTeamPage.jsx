import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SkillTagSelector from '../components/SkillTagSelector';
import { validateTeamName } from '../utils/validators';

export default function CreateTeamPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorDepartment, setMentorDepartment] = useState('');
  const [psId1, setPsId1] = useState('');
  const [psId2, setPsId2] = useState('');
  const [neededSkills, setNeededSkills] = useState([]);
  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('problem_statements').select('*').order('ps_code').then(({ data }) => {
      setProblemStatements(data || []);
    });
  }, []);

  // Check if user already has a team
  useEffect(() => {
    if (profile) {
      supabase
        .from('team_members')
        .select('team_id')
        .eq('student_id', profile.id)
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            navigate('/my-team');
          }
        });
    }
  }, [profile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nameValidation = validateTeamName(teamName);
    if (!nameValidation.valid) {
      setError(nameValidation.message);
      return;
    }

    if (!psId1) {
      setError('Problem Statement 1 (Primary) is mandatory.');
      return;
    }
    if (psId2 && psId1 === psId2) {
      setError('Problem Statement 2 must be different from Problem Statement 1.');
      return;
    }

    setLoading(true);

    try {
      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          team_name: teamName.trim(),
          leader_id: profile.id,
          ps_id: psId1,
          ps_id_2: psId2 || null,
          needed_skills: neededSkills,
          mentor_name: mentorName.trim() || null,
          mentor_department: mentorDepartment.trim() || null
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team leader member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData.id,
          student_id: profile.id,
          member_role: 'Leader'
        });

      if (memberError) throw memberError;

      navigate('/my-team');
    } catch (err) {
      setError(err.message || 'Failed to create team.');
    }

    setLoading(false);
  };

  return (
    <div className="page-container"style={{ maxWidth: '640px', margin: '0 auto', padding: '30px' }}>
      <div className="page-header">
        <h1 className="page-title"> Create a Team</h1>
        <p className="page-subtitle">Start your SIH journey by forming a team. You'll be the Team Leader.</p>
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
          <div className="form-group">
            <label className="form-label">Team Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., CodeCrafters, InnoVision, TechTitans"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              maxLength={50}
            />
            <div className="form-hint">Choose a unique, creative team name (3-50 characters)</div>
          </div>

          <div className="form-group">
            <label className="form-label">Mentor Name (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Dr. Smith"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mentor Department (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Computer Science"
              value={mentorDepartment}
              onChange={(e) => setMentorDepartment(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Problem Statement 1 (Primary) <span className="required">*</span></label>
            <select
              className="form-select"
              value={psId1}
              onChange={(e) => setPsId1(e.target.value)}
            >
              <option value="">Select a Primary Problem Statement</option>
              {problemStatements.map(ps => (
                <option key={ps.id} value={ps.id}>
                  [{ps.ps_code}] {ps.title} ({ps.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Problem Statement 2 (Secondary - Optional)</label>
            <select
              className="form-select"
              value={psId2}
              onChange={(e) => setPsId2(e.target.value)}
            >
              <option value="">Select a Secondary Problem Statement (optional)</option>
              {problemStatements.map(ps => (
                <option key={ps.id} value={ps.id}>
                  [{ps.ps_code}] {ps.title} ({ps.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Skills Needed in Teammates</label>
            <SkillTagSelector
              selectedSkills={neededSkills}
              onChange={setNeededSkills}
              maxSkills={8}
            />
            <div className="form-hint">Help potential teammates find your team through skill matching</div>
          </div>

          <button
            type="submit"
            className="btn btn-orange btn-lg w-full"
            disabled={loading}
          >
            {loading ? 'Creating Team...' : 'Create Team & Become Leader'}
          </button>
        </form>
      </div>
    </div>
  );
}
