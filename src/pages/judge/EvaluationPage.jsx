import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import RubricRadioGroup from '../../components/RubricRadioGroup';
import { prepareEvaluationPayload, parseEvaluationScores } from '../../lib/evaluationHelper';

export default function EvaluationPage() {
  const { profile } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [evaluationsMap, setEvaluationsMap] = useState({});
  const [evaluatedTeams, setEvaluatedTeams] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [judgePanelName, setJudgePanelName] = useState(null);
  const [judgePanelAssigned, setJudgePanelAssigned] = useState(true);

  // 6 Official Rubric scoring parameters (initially null - no option selected)
  const [novelty, setNovelty] = useState(null);         // Max 10
  const [technical, setTechnical] = useState(null);       // Max 10
  const [feasibility, setFeasibility] = useState(null);   // Max 10
  const [impact, setImpact] = useState(null);             // Max 10
  const [prototype, setPrototype] = useState(null);       // Max 5
  const [presentation, setPresentation] = useState(null); // Max 5
  const [remarks, setRemarks] = useState('');

  // Check if all 6 parameters have a selected score
  const isAllSelected =
    novelty !== null &&
    technical !== null &&
    feasibility !== null &&
    impact !== null &&
    prototype !== null &&
    presentation !== null;

  // Total Score (Max 50)
  const total =
    (novelty ?? 0) +
    (technical ?? 0) +
    (feasibility ?? 0) +
    (impact ?? 0) +
    (prototype ?? 0) +
    (presentation ?? 0);

  const selectedCount = [
    novelty,
    technical,
    feasibility,
    impact,
    prototype,
    presentation
  ].filter(v => v !== null).length;

  useEffect(() => {
    fetchData();
  }, [profile]);

  async function fetchData() {
    setLoading(true);
    try {
      let allowedPsIds = null;

      if (profile?.role === 'judge') {
        // Fetch judge's assigned panel
        const { data: pjData } = await supabase
          .from('panel_judges')
          .select('panel_id, judge_panels(name)')
          .eq('judge_id', profile.id)
          .limit(1)
          .single();

        if (pjData?.panel_id) {
          setJudgePanelName(pjData.judge_panels?.name || 'Assigned Panel');
          setJudgePanelAssigned(true);

          const { data: panelPsData } = await supabase
            .from('panel_problem_statements')
            .select('ps_id')
            .eq('panel_id', pjData.panel_id);

          allowedPsIds = (panelPsData || []).map(pps => pps.ps_id);
        } else {
          setJudgePanelAssigned(false);
          setTeams([]);
          setLoading(false);
          return;
        }
      }

      // Query all teams registered under the panel's themes
      let query = supabase
        .from('teams')
        .select('*, problem_statements(ps_code, title)')
        .not('ps_id', 'is', null)
        .order('team_name');

      if (allowedPsIds !== null) {
        if (allowedPsIds.length === 0) {
          // Panel has no themes assigned yet
          setTeams([]);
          setLoading(false);
          return;
        }
        query = query.in('ps_id', allowedPsIds);
      }

      const { data: teamsData } = await query;

      // Fetch judge's existing evaluations
      if (profile) {
        const { data: evalData } = await supabase
          .from('evaluations')
          .select('*')
          .eq('judge_id', profile.id);

        const evalMap = {};
        (evalData || []).forEach(e => {
          const parsed = parseEvaluationScores(e);
          evalMap[e.team_id] = { ...e, parsed };
        });
        setEvaluationsMap(evalMap);
        setEvaluatedTeams(new Set(Object.keys(evalMap)));
      }

      setTeams(teamsData || []);
    } catch (err) {
      console.error('Error in EvaluationPage fetchData:', err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    const existing = evaluationsMap[team.id];
    if (existing?.parsed) {
      // Pre-fill existing submitted evaluation for this judge
      const { rubric, remarks: parsedRemarks } = existing.parsed;
      setNovelty(rubric.novelty ?? rubric.innovation ?? null);
      setTechnical(rubric.technical ?? null);
      setFeasibility(rubric.feasibility ?? rubric.understanding ?? null);
      setImpact(rubric.impact ?? null);
      setPrototype(rubric.prototype ?? null);
      setPresentation(rubric.presentation ?? null);
      setRemarks(parsedRemarks || '');
    } else {
      // Reset all 6 parameters to null (unselected)
      setNovelty(null);
      setTechnical(null);
      setFeasibility(null);
      setImpact(null);
      setPrototype(null);
      setPresentation(null);
      setRemarks('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedTeam || !profile) return;

    // Strict validation: all 6 parameters must have a selected radio score
    const missing = [];
    if (novelty === null) missing.push('Novelty & Innovation (0-10)');
    if (technical === null) missing.push('Technical Approach & Complexity (0-10)');
    if (feasibility === null) missing.push('Feasibility & Viability (0-10)');
    if (impact === null) missing.push('Impact, Scale & Sustainability (0-10)');
    if (prototype === null) missing.push('Prototype Readiness (0-5)');
    if (presentation === null) missing.push('Presentation & Format (0-5)');

    if (missing.length > 0) {
      showToast('error', `Please select scores for all 6 parameters. Missing: ${missing.join(', ')}`);
      return;
    }

    // Strict range verification
    if (
      novelty < 0 || novelty > 10 ||
      technical < 0 || technical > 10 ||
      feasibility < 0 || feasibility > 10 ||
      impact < 0 || impact > 10 ||
      prototype < 0 || prototype > 5 ||
      presentation < 0 || presentation > 5
    ) {
      showToast('error', 'Invalid score selected. Please stay within the official rubric ranges.');
      return;
    }

    setSubmitting(true);

    const payload = prepareEvaluationPayload({
      teamId: selectedTeam.id,
      judgeId: profile.id,
      novelty,
      technical,
      feasibility,
      impact,
      prototype,
      presentation,
      remarks
    });

    try {
      // Check if existing evaluation row exists
      const { data: existingRow } = await supabase
        .from('evaluations')
        .select('id')
        .eq('team_id', selectedTeam.id)
        .eq('judge_id', profile.id)
        .maybeSingle();

      let saveError = null;
      let savedData = null;

      if (existingRow?.id) {
        // UPDATE existing evaluation
        const res = await supabase
          .from('evaluations')
          .update(payload)
          .eq('id', existingRow.id)
          .select();
        saveError = res.error;
        savedData = res.data?.[0];
      } else {
        // INSERT new evaluation
        const res = await supabase
          .from('evaluations')
          .insert(payload)
          .select();
        saveError = res.error;
        savedData = res.data?.[0];
      }

      if (saveError) {
        console.error('Evaluation save error:', saveError);
        showToast('error', saveError.message);
      } else {
        showToast('success', `✓ Evaluation saved for "${selectedTeam.team_name}" — Score: ${total}/50`);
        const parsed = parseEvaluationScores(savedData || payload);
        setEvaluationsMap(prev => ({
          ...prev,
          [selectedTeam.id]: { ...(savedData || payload), parsed }
        }));
        setEvaluatedTeams(prev => new Set([...prev, selectedTeam.id]));
        setSelectedTeam(null);
      }
    } catch (err) {
      console.error('Unexpected save error:', err);
      showToast('error', err.message || 'Failed to save evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading) return <div className="page-container"><div className="loading-spinner"><div className="spinner" /></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Evaluate Teams</h1>
        <p className="page-subtitle">
          {profile?.role === 'judge'
            ? judgePanelAssigned
              ? `Panel Scope: ${judgePanelName} — Official SAH Evaluation Rubric (50 Marks)`
              : 'You have not been assigned to a Judge Panel yet'
            : 'Official SAH Evaluation Rubric (50 Marks)'}
        </p>
      </div>

      {profile?.role === 'judge' && !judgePanelAssigned && (
        <div style={{
          padding: '16px 20px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          color: '#92400E',
          marginBottom: '24px',
          fontSize: '0.92rem'
        }}>
          You have not been assigned to a Judge Panel yet. Please contact an Admin to be assigned to a panel and receive themes for evaluation.
        </div>
      )}

      {(!judgePanelAssigned && profile?.role === 'judge') ? null : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTeam ? '1fr 1.3fr' : '1fr', gap: '24px', alignItems: 'start' }}>
          {/* Team List */}
          <div>
            <h3 style={{ marginBottom: '12px' }}>
              Assigned Teams for Evaluation ({teams.length})
            </h3>

            {teams.length === 0 ? (
              <div className="card" style={{ padding: '28px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  {profile?.role === 'judge'
                    ? 'No teams have registered under your panel\'s assigned themes yet.'
                    : 'No teams available for evaluation.'}
                </p>
              </div>
            ) : (
              teams.map(team => {
                const isScored = evaluatedTeams.has(team.id);
                const isCurrent = selectedTeam?.id === team.id;
                const existingScore = evaluationsMap[team.id]?.total_raw;

                return (
                  <div
                    key={team.id}
                    className="card"
                    style={{
                      marginBottom: '10px',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      border: isCurrent ? '2px solid var(--orange)' : '1px solid var(--border-light)',
                      background: isCurrent ? '#FFFBF7' : '#ffffff',
                      transition: 'transform 0.15s, box-shadow 0.15s'
                    }}
                    onClick={() => handleSelectTeam(team)}
                  >
                    <div className="flex-between">
                      <div>
                        <strong>{team.team_name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {team.problem_statements?.ps_code} — {team.problem_statements?.title || 'N/A'}
                        </div>
                      </div>
                      <div>
                        {isScored ? (
                          <span className="pill-badge status-verified">
                            ✓ Scored ({existingScore ?? '—'}/50)
                          </span>
                        ) : (
                          <span className="pill-badge status-open">
                            ⏳ Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Official Rubric Radio Form */}
          {selectedTeam && (
            <div className="card card-elevated" style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
              {/* Team & Judge Metadata Header */}
              <div style={{
                background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
                color: '#ffffff',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Team Evaluation Form
                </div>
                <h3 style={{ margin: '4px 0 8px', color: '#ffffff', fontSize: '1.25rem' }}>
                  {selectedTeam.team_name}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', fontSize: '0.78rem', color: '#e2e8f0', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px', marginTop: '6px' }}>
                  <div>
                    <strong style={{ color: '#ffffff' }}>Problem Statement:</strong><br />
                    {selectedTeam.problem_statements?.ps_code || 'N/A'}
                  </div>
                  <div>
                    <strong style={{ color: '#ffffff' }}>Panel:</strong><br />
                    {judgePanelName || 'Assigned Panel'}
                  </div>
                  <div>
                    <strong style={{ color: '#ffffff' }}>Evaluator:</strong><br />
                    {profile?.full_name || 'Judge'}
                  </div>
                </div>
              </div>

              {/* 1. Novelty & Innovation (0-10) */}
              <RubricRadioGroup
                name="novelty"
                label="1. Novelty & Innovation"
                description="Originality against existing approaches; differentiation from earlier SIH submissions & off-the-shelf products"
                max={10}
                value={novelty}
                onChange={setNovelty}
              />

              {/* 2. Technical Approach & Complexity (0-10) */}
              <RubricRadioGroup
                name="technical"
                label="2. Technical Approach & Complexity"
                description="Soundness of architecture & methodology; justification of tech stack; engineering depth & non-triviality"
                max={10}
                value={technical}
                onChange={setTechnical}
              />

              {/* 3. Feasibility & Viability (0-10) */}
              <RubricRadioGroup
                name="feasibility"
                label="3. Feasibility & Viability"
                description="Buildability within Grand Finale window; risks identified with credible mitigation; realistic resource assumptions"
                max={10}
                value={feasibility}
                onChange={setFeasibility}
              />

              {/* 4. Impact, Scale & Sustainability (0-10) */}
              <RubricRadioGroup
                name="impact"
                label="4. Impact, Scale & Sustainability"
                description="Benefit to end user & sponsoring org; scale of impact; social, economic & environmental sustainability"
                max={10}
                value={impact}
                onChange={setImpact}
              />

              {/* 5. Prototype & Demonstration Readiness (0-5) */}
              <RubricRadioGroup
                name="prototype"
                label="5. Prototype & Demonstration Readiness"
                description="Evidence of working module or validated POC; quality of live demonstration & measured results"
                max={5}
                value={prototype}
                onChange={setPrototype}
              />

              {/* 6. Presentation & Format Compliance (0-5) */}
              <RubricRadioGroup
                name="presentation"
                label="6. Presentation & Format Compliance"
                description="Clarity of pitch; adherence to six-slide SIH format; quality of response to jury questions"
                max={5}
                value={presentation}
                onChange={setPresentation}
              />

              {/* Total Score Display (Max 50) */}
              <div style={{
                background: 'linear-gradient(135deg, #0B192C 0%, #1E293B 100%)',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '20px',
                boxShadow: '0 8px 24px rgba(11, 25, 44, 0.25)',
                border: '1px solid rgba(255, 107, 0, 0.3)'
              }}>
                <div style={{ fontSize: '0.78rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#FF8800' }}>
                  TOTAL SCORE EVALUATION
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#FFFFFF', lineHeight: 1.1, margin: '6px 0' }}>
                  {total} <span style={{ fontSize: '1.4rem', color: '#94A3B8', fontWeight: 600 }}>/ 50</span>
                </div>

                {/* Score Progress Bar */}
                <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: '12px 0 8px' }}>
                  <div style={{
                    width: `${(total / 50) * 100}%`,
                    height: '100%',
                    background: total >= 40 ? '#10B981' : total >= 25 ? '#FF8800' : '#EF4444',
                    transition: 'width 0.3s ease, background 0.3s ease'
                  }} />
                </div>

                <div style={{ fontSize: '0.78rem', color: '#CBD5E1', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{selectedCount} of 6 Criteria Rated</span>
                  <strong style={{ color: total >= 40 ? '#34D399' : total >= 25 ? '#FBBF24' : '#F87171' }}>
                    {total >= 40 ? 'Top Contender' : total >= 25 ? 'Solid Solution' : 'Needs Improvement'}
                  </strong>
                </div>
              </div>

              {/* Remarks Textarea */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Remarks / Feedback (Optional)
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Optional: Add specific feedback or notes for this team's prototype and presentation..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-primary btn-lg w-full"
                onClick={handleSubmit}
                disabled={submitting || !isAllSelected}
                style={{
                  padding: '14px 20px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  opacity: !isAllSelected ? 0.6 : 1,
                  cursor: !isAllSelected ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting
                  ? 'Submitting Evaluation...'
                  : isAllSelected
                    ? `Submit Evaluation (${total}/50)`
                    : 'Select Scores for All 6 Parameters to Submit'}
              </button>
            </div>
          )}
        </div>
      )}

      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 99999 }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

