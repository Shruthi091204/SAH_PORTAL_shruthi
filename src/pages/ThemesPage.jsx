import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import problemStatementsData from '../../data/sihProblemStatements.json';

export default function ThemesPage() {
  const { profile } = useAuth();
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [judgePanelName, setJudgePanelName] = useState(null);
  const [judgePanelAssigned, setJudgePanelAssigned] = useState(true);

  const isJudge = profile?.role === 'judge';

  useEffect(() => {
    fetchProblemStatements();
  }, [profile]);

  async function fetchProblemStatements() {
    setLoading(true);
    try {
      if (isJudge && profile?.id) {
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

          // Fetch only theme IDs assigned to this panel
          const { data: panelPsData } = await supabase
            .from('panel_problem_statements')
            .select('ps_id')
            .eq('panel_id', pjData.panel_id);

          const psIds = (panelPsData || []).map(pps => pps.ps_id);

          if (psIds.length > 0) {
            const { data: psData } = await supabase
              .from('problem_statements')
              .select('*')
              .in('id', psIds)
              .order('ps_code');

            setStatements(psData || []);
          } else {
            setStatements([]);
          }
        } else {
          setJudgePanelAssigned(false);
          setStatements([]);
        }
      } else {
        // Admin, SPOC, Student, or Public: Fetch all from local data
        const data = problemStatementsData.map(ps => ({
          id: ps.sno,
          ps_code: ps.psNumber,
          title: ps.title,
          category: ps.category,
          domain: ps.theme,
          organization: ps.org
        }));

        setStatements(data || []);
      }
    } catch (err) {
      console.error('Error loading themes:', err);
      setStatements([]);
    } finally {
      setLoading(false);
    }
  }

  const domains = useMemo(() => {
    return Array.from(new Set(statements.map(ps => ps.domain))).sort();
  }, [statements]);

  const getThemeStyle = (domain) => {
    const themeColors = {
      'Disaster Management': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
      'Smart Automation': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
      'Space Technology': { bg: '#F3E8FF', text: '#6B21A8', border: '#D8B4FE' },
      'Smart Vehicles': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
      'Transportation & Logistics': { bg: '#E0F2FE', text: '#0369A1', border: '#7DD3FC' },
      'Robotics and Drones': { bg: '#FFE4E6', text: '#9F1239', border: '#FDA4AF' },
      'Miscellaneous': { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
      'Agriculture, FoodTech & Rural Development': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
      'MedTech / BioTech / HealthTech': { bg: '#FCE7F3', text: '#9D174D', border: '#F9A8D4' },
      'Blockchain & Cybersecurity': { bg: '#CCFBF1', text: '#0F766E', border: '#5EEAD4' },
      'Fitness & Sports': { bg: '#FFEDD5', text: '#9A3412', border: '#FDBA74' },
      'Heritage & Culture': { bg: '#FAFAF9', text: '#44403C', border: '#D6D3D1' },
      'Smart Education': { bg: '#FEF08A', text: '#854D0E', border: '#FDE047' },
      'Travel & Tourism': { bg: '#ECFCCB', text: '#3F6212', border: '#BEF264' },
      'Renewable / Sustainable Energy': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
      'Clean & Green Technology': { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
      'Smart Resource Conservation': { bg: '#E0F2FE', text: '#075985', border: '#38BDF8' },
      'Toys & Games': { bg: '#F5F3FF', text: '#5B21B6', border: '#C4B5FD' }
    };
    return themeColors[domain] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
  };

  const filtered = useMemo(() => {
    return statements.filter(ps => {
      if (search) {
        const term = search.toLowerCase();
        if (!ps.ps_code.toLowerCase().includes(term) && !ps.title.toLowerCase().includes(term) && !ps.organization.toLowerCase().includes(term)) return false;
      }
      if (categoryFilter && ps.category !== categoryFilter) return false;
      if (domainFilter && ps.domain !== domainFilter) return false;
      return true;
    });
  }, [statements, search, categoryFilter, domainFilter]);

  const hwCount = statements.filter(s => s.category === 'Hardware').length;
  const swCount = statements.filter(s => s.category === 'Software').length;

  if (loading) return <div className="page-container"><div className="loading-spinner"><div className="spinner" /></div></div>;

  return (
    <div className="page-container">
      <div className="hero-banner">
        <h1>{isJudge ? `Problem Statements (${judgePanelName || 'Panel Scope'})` : 'Problem Statements'}</h1>
        <p>
          {isJudge
            ? judgePanelAssigned
              ? `Displaying themes exclusively assigned to your panel: ${judgePanelName}`
              : 'You have not been assigned to a Judge Panel yet. Please contact an Admin.'
            : 'Browse all themes for Smart Amrita Hackathon 2026'}
        </p>
      </div>

      {isJudge && !judgePanelAssigned && (
        <div style={{
          padding: '16px 20px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          color: '#92400E',
          marginBottom: '24px',
          fontSize: '0.92rem'
        }}>
          You have not been assigned to a Judge Panel yet. Please contact an Admin to be assigned to a panel and view your allocated themes.
        </div>
      )}

      <div className="stats-row"style={{ marginBottom: '24px' }}>
        <StatCard number={statements.length} label="Total Problem Statements" />
        <StatCard number={hwCount} label="Hardware"accent />
        <StatCard number={swCount} label="Software"accent />
        <StatCard number={domains.length} label="Domains" />
      </div>

      <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="search-input"
            placeholder="Search by PS code, title, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '300px' }}
          />
          <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All Categories</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>Themes:</span>
          <button
            onClick={() => setDomainFilter('')}
            style={{
              padding: '6px 14px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
              border: domainFilter === '' ? '1px solid #374151' : '1px solid #D1D5DB',
              background: domainFilter === '' ? '#374151' : '#FFFFFF',
              color: domainFilter === '' ? '#FFFFFF' : '#374151',
              transition: 'all 0.2s ease'
            }}
          >
            All
          </button>
          {domains.map(d => {
            const style = getThemeStyle(d);
            const isActive = domainFilter === d;
            return (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                style={{
                  padding: '6px 14px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                  border: `1px solid ${isActive ? style.text : style.border}`,
                  background: isActive ? style.text : style.bg,
                  color: isActive ? '#FFFFFF' : style.text,
                  transition: 'all 0.2s ease'
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '120px' }}>PS Code</th>
              <th>Title</th>
              <th style={{ width: '100px' }}>Category</th>
              <th>Theme</th>
              <th>Organization</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No problem statements found matching your filters.</td></tr>
            ) : (
              filtered.map(ps => {
                const themeStyle = getThemeStyle(ps.domain);
                return (
                  <tr key={ps.id} style={{ backgroundColor: themeStyle.bg, transition: 'background-color 0.2s' }}>
                    <td><strong>{ps.ps_code}</strong></td>
                    <td>{ps.title}</td>
                    <td>
                      <span className={`pill-badge ${ps.category === 'Hardware' ? 'domain' : 'skill'}`}>
                        {ps.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: themeStyle.text }}>
                      {ps.domain}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{ps.organization}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
