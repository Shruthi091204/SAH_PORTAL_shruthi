import { useState } from 'react';

const RUBRIC_CRITERIA = [
  {
    id: 'novelty',
    title: 'Novelty & Innovation',
    category: 'idea',
    max: 10,
    weightPct: 20,
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    description: 'Originality against existing and known approaches; clear differentiation from earlier SIH submissions and off-the-shelf products.',
    levels: [
      { score: '0 - 3', title: 'Low Novelty', text: 'Minor tweaks to existing solutions or standard off-the-shelf products.' },
      { score: '4 - 7', title: 'Innovative', text: 'Clear differentiation with original technical concepts.' },
      { score: '8 - 10', title: 'Disruptive', text: 'Highly original, breakthrough innovation with strong IP potential.' }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Approach & Complexity',
    category: 'technical',
    max: 5,
    weightPct: 10,
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.08)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    description: 'Soundness of architecture and methodology; justification of the technology stack; engineering depth and non-triviality.',
    levels: [
      { score: '0 - 1', title: 'Trivial', text: 'Basic framework usage with superficial technical depth.' },
      { score: '2 - 3', title: 'Sound Tech', text: 'Well-justified tech stack, solid architecture & methodology.' },
      { score: '4 - 5', title: 'Engineering Depth', text: 'Complex, non-trivial engineering & robust system design.' }
    ]
  },
  {
    id: 'feasibility',
    title: 'Feasibility & Viability',
    category: 'technical',
    max: 10,
    weightPct: 20,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    description: 'Buildability within the Grand Finale window; risks identified with credible mitigation; realism of cost, data and resource assumptions.',
    levels: [
      { score: '0 - 3', title: 'High Risk', text: 'Unrealistic assumptions or unaddressed execution risks.' },
      { score: '4 - 7', title: 'Feasible', text: 'Buildable within Finale timeline with credible risk mitigation.' },
      { score: '8 - 10', title: 'Highly Viable', text: 'Pragmatic, resource-sound & ready for Grand Finale build.' }
    ]
  },
  {
    id: 'impact',
    title: 'Impact, Scale & Sustainability',
    category: 'impact',
    max: 10,
    weightPct: 20,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    description: 'Benefit to the end user and the sponsoring organisation; scale of impact; social, economic and environmental sustainability; scope for future work.',
    levels: [
      { score: '0 - 3', title: 'Limited', text: 'Minimal user benefit or localized deployment scope.' },
      { score: '4 - 7', title: 'High Value', text: 'Clear beneficiary impact, economic & social sustainability.' },
      { score: '8 - 10', title: 'Transformative', text: 'Massive scale potential, sustainable & long-term roadmap.' }
    ]
  },
  {
    id: 'prototype',
    title: 'Prototype & Demonstration Readiness',
    category: 'technical',
    max: 10,
    weightPct: 20,
    color: '#FF6B00',
    bgColor: 'rgba(255, 107, 0, 0.08)',
    borderColor: 'rgba(255, 107, 0, 0.35)',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.66 1.4-2.6L4.5 16.5z" />
        <path d="M12 15l-3-3 7.5-7.5.5.5a2.12 2.12 0 0 1 0 3L12 15z" />
        <path d="M11.5 6.5l3 3" />
      </svg>
    ),
    description: 'Evidence of a working module or validated proof of concept; quality of the live demonstration; ability to explain measured results.',
    levels: [
      { score: '0 - 3', title: 'Unvalidated', text: 'Concept stage without working module evidence.' },
      { score: '4 - 7', title: 'POC Validated', text: 'Working module or proof of concept demonstrated.' },
      { score: '8 - 10', title: 'Live Ready', text: 'High-quality live demo with validated, measured results.' }
    ]
  },
  {
    id: 'presentation',
    title: 'Presentation & Format Compliance',
    category: 'impact',
    max: 5,
    weightPct: 10,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    description: 'Clarity of the pitch; adherence to the six-slide SIH Idea Submission format; quality of response to jury questions.',
    levels: [
      { score: '0 - 1', title: 'Non-Compliant', text: 'Unclear pitch or deviation from 6-slide format.' },
      { score: '2 - 3', title: 'Format Met', text: 'Adheres to 6-slide SIH format with clear pitch.' },
      { score: '4 - 5', title: 'Jury Approved', text: 'Compelling pitch with excellent response to jury Q&A.' }
    ]
  }
];

const AWARDS_LIST = [
  { title: 'Best Software Edition Team', basis: 'Highest overall score among entries in Software PS Category (Winner & Runner-Up)' },
  { title: 'Best Hardware Edition Team', basis: 'Highest overall score among entries in Hardware PS Category (Winner & Runner-Up)' },
  { title: 'Best Student Innovation Idea', basis: 'Strongest self-proposed idea mapped to a notified SIH theme (Winner & Runner-Up)' },
  { title: 'Theme Excellence Award', basis: 'Best team in each SIH theme receiving at least 3 qualifying entries' },
  { title: 'Best Interdisciplinary Team', basis: 'Most effective integration of two or more departments' },
  { title: 'Best All-Women Team', basis: 'Highest-scoring team composed entirely of women members' },
  { title: 'Young Innovator Award', basis: 'Most promising team drawn from 1st and 2nd year students' }
];

export default function OfficialRubricCard({ isModal = false, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCriteria = activeCategory === 'all'
    ? RUBRIC_CRITERIA
    : RUBRIC_CRITERIA.filter(c => c.category === activeCategory);

  const content = (
    <div style={{ padding: isModal ? '28px' : '0' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0B192C 0%, #1E293B 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(11, 25, 44, 0.2)',
        marginBottom: '24px'
      }}>
        {/* Glow Element */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 107, 0, 0.15)',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              color: '#FF8800',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              ★ Official SIH Jury Rubric
            </div>
            <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Official SAH / SIH 2026 Evaluation Rubric
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#94A3B8' }}>
              Standardized 6-criterion evaluation framework used by official jury panels (Max 50 Marks).
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '12px 22px',
            borderRadius: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Maximum Score
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FF8800', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
              50 <span style={{ fontSize: '1rem', color: '#CBD5E1', fontWeight: 600 }}>Marks</span>
            </div>
          </div>
        </div>

        {/* Stacked Weightage Distribution Bar */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94A3B8', marginBottom: '8px', fontWeight: 600 }}>
            <span>Jury Weightage Distribution</span>
            <span>Innovation (20%) · Technical (10%) · Feasibility (20%) · Impact (20%) · Prototype (20%) · Pitch (10%)</span>
          </div>

          <div style={{ display: 'flex', height: '10px', borderRadius: '6px', overflow: 'hidden', gap: '2px', background: 'rgba(0,0,0,0.3)' }}>
            {RUBRIC_CRITERIA.map(c => (
              <div
                key={c.id}
                title={`${c.title}: ${c.max} Marks (${c.weightPct}%)`}
                style={{
                  width: `${c.weightPct}%`,
                  height: '100%',
                  background: c.color,
                  transition: 'opacity 0.2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { key: 'all', label: 'All 6 Criteria (50 Mks)' },
          { key: 'technical', label: '⚙️ Technical, Feasibility & Demo (25 Mks)' },
          { key: 'idea', label: '💡 Novelty & Innovation (10 Mks)' },
          { key: 'impact', label: '🌍 Impact & Presentation (15 Mks)' },
          { key: 'awards', label: '🏆 Recognition & Awards' }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1.5px solid ${activeCategory === tab.key ? 'var(--orange)' : 'var(--border)'}`,
              background: activeCategory === tab.key ? '#FFF3EB' : 'var(--white)',
              color: activeCategory === tab.key ? 'var(--orange)' : 'var(--navy)',
              transition: 'all 0.2s ease',
              boxShadow: activeCategory === tab.key ? '0 2px 8px rgba(255, 107, 0, 0.15)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Awards Tab */}
      {activeCategory === 'awards' ? (
        <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.2rem' }}>🏆 SAH 2026 Official Recognition & Award Categories</h3>
          <p style={{ margin: '0 0 18px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            In addition to SIH 2026 National Portal Nomination, the jury will confer awards across the following categories (Winner & Runner-Up):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {AWARDS_LIST.map((award, i) => (
              <div key={i} style={{ background: 'var(--white)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', borderLeft: '4px solid var(--orange)' }}>
                <strong style={{ color: 'var(--navy)', fontSize: '0.92rem', display: 'block', marginBottom: '4px' }}>{award.title}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{award.basis}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Grid of Rubric Criteria Cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredCriteria.map((c) => (
            <div
              key={c.id}
              style={{
                padding: '22px',
                background: 'var(--white)',
                border: `1px solid ${c.borderColor}`,
                borderTop: `4px solid ${c.color}`,
                borderRadius: '16px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: c.bgColor,
                    color: c.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {c.svg}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Criterion 0{RUBRIC_CRITERIA.findIndex(rc => rc.id === c.id) + 1}
                    </span>
                    <h4 style={{ margin: '1px 0 0 0', fontSize: '1rem', fontWeight: 800, color: 'var(--navy)' }}>
                      {c.title}
                    </h4>
                  </div>
                </div>

                <span className="pill-badge" style={{
                  background: c.bgColor,
                  color: c.color,
                  border: `1px solid ${c.borderColor}`,
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '4px 12px',
                  borderRadius: '14px'
                }}>
                  {c.max} Marks
                </span>
              </div>

              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--navy)' }}>What the Jury Looks For:</strong> {c.description}
              </p>

              {/* Level Scoring Brackets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                  Scoring Breakdown Tiers:
                </div>
                {c.levels.map((lvl, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem' }}>
                    <span style={{
                      fontWeight: 800,
                      color: c.color,
                      background: c.bgColor,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      width: '52px',
                      textAlign: 'center',
                      flexShrink: 0,
                      fontSize: '0.75rem'
                    }}>
                      {lvl.score}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--navy)', width: '105px', flexShrink: 0 }}>
                      {lvl.title}:
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.78rem' }}>
                      {lvl.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!isModal) {
    return (
      <div className="card" style={{ padding: '24px', marginTop: '24px', borderRadius: '20px' }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(11, 25, 44, 0.8)',
      backdropFilter: 'blur(6px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '960px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--off-white)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: 'var(--navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          ✕
        </button>
        {content}
      </div>
    </div>
  );
}
