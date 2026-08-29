import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdNewsTicker() {
  const [adTeams, setAdTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdTeams() {
      const { data, error } = await supabase
        .from('teams')
        .select('team_name, needed_skills, recruitment_message, profiles!teams_leader_id_fkey(email)')
        .eq('is_open_for_recruitment', true)
        .eq('is_locked', false)
        .not('recruitment_message', 'is', null);

      if (error) {
        // Fallback or silently ignore if column doesn't exist yet
        return;
      }

      if (data) {
        setAdTeams(data.filter(t => t.needed_skills && t.needed_skills.length > 0));
      }
    }
    fetchAdTeams();
  }, []);

  const displayTeams = adTeams.length > 0 ? adTeams : [
    {
      isPlaceholder: true,
      team_name: "Hire Top Talent!",
      recruitment_message: "Team Leaders: Need a specific skill? Post an ad from your Team Dashboard to recruit the perfect teammate.",
      needed_skills: ["Any Skill"]
    }
  ];

  const filteredTeams = displayTeams.filter(team => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      team.team_name.toLowerCase().includes(q) ||
      (team.recruitment_message && team.recruitment_message.toLowerCase().includes(q)) ||
      (team.needed_skills && team.needed_skills.some(s => s.toLowerCase().includes(q)))
    );
  });

  return (
    <>
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #ea580c, #f97316)',
          color: 'white',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 40,
          boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)',
          cursor: 'pointer'
        }}
        onClick={() => setShowModal(true)}
      >


        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            flex: 1,
            gap: '30px'
          }}
          className="hide-scrollbar"
        >
          <style>
            {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .ticker-animation {
                display: inline-flex;
                gap: 40px;
                animation: ticker ${displayTeams.length * 75}s linear infinite;
              }
              .ticker-animation:hover {
                animation-play-state: paused;
              }
              @keyframes ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }

            `}
          </style>
          <div className="ticker-animation" style={{ paddingRight: '40px' }}>
            {/* Repeat list multiple times to create seamless loop even for 1 item */}
            {Array.from({ length: 10 }).flatMap(() => displayTeams).map((team, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                <strong style={{ fontWeight: 800 }}>{team.team_name}</strong>
                {team.recruitment_message && (
                  <>
                    <span style={{ opacity: 0.8 }}>|</span>
                    <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>"{team.recruitment_message}"</span>
                  </>
                )}
                {team.needed_skills && team.needed_skills.length > 0 && (
                  <>
                    <span style={{ opacity: 0.8 }}>|</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {team.needed_skills.map(s => (
                        <span key={s} style={{ background: 'white', color: '#ea580c', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sticky View All Button */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', padding: '0 16px 0 32px', background: 'linear-gradient(to right, transparent, #f97316 30%, #f97316)', zIndex: 10 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, background: 'white', color: '#ea580c', padding: '6px 12px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(234,88,12,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View All</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>

            <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'linear-gradient(to right, #ea580c, #f97316)', color: 'white', gap: '16px' }}>
              <div style={{ flex: 1 }}>

                <p style={{ margin: '6px 0 0 0', fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.4 }}>
                  Exclusive Opportunities! Teams are scouting for niche talent to complete their winning rosters. If you have the exact skills they need, reach out to the Team Leader instantly!
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px', overflowY: 'auto', background: '#f8fafc', flex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Search by skill, team name, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTeams.length > 0 ? filteredTeams.map((team, idx) => (
                  <div key={idx} style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{team.team_name}</h4>
                      {team.isPlaceholder ? (
                        <button 
                          onClick={() => { setShowModal(false); navigate('/dashboard'); }}
                          style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Go to Dashboard
                        </button>
                      ) : team.profiles?.email && (
                        <a
                          href={`mailto:${team.profiles.email}`}
                          style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                        >
                          ✉ Contact: {team.profiles.email}
                        </a>
                      )}
                    </div>

                    {team.recruitment_message && (
                      <div style={{ fontSize: '0.95rem', color: '#334155', fontStyle: 'italic', padding: '12px', background: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #ea580c', marginBottom: '16px' }}>
                        "{team.recruitment_message}"
                      </div>
                    )}

                    {team.needed_skills && team.needed_skills.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800, marginBottom: '8px' }}>Looking for skills:</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {team.needed_skills.map(s => (
                            <span key={s} style={{ background: '#0f172a', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                    <p style={{ margin: 0 }}>No teams found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
