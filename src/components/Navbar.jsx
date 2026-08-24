import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, profile } = useAuth();
  const location = useLocation();
  const [showOtherEvents, setShowOtherEvents] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOtherEvents(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const toggleDropdown = (e) => {
    if (!showOtherEvents) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: (rect.bottom + 4) + 'px', // 4px gap below navbar
        left: rect.left + 'px',
        background: '#ffffff',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        minWidth: '220px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      });
    }
    setShowOtherEvents(!showOtherEvents);
  };

  // Hide navbar on login/register pages
  if (['/login', '/register'].includes(location.pathname)) return null;

  const studentTabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/marketplace', label: 'Team Recruitment' },
    { path: '/my-team', label: 'My Team & Pitch' },
    { path: '/themes', label: 'Themes' },
    { path: '/problem-statements', label: 'Problem Statements' },
    { path: '/profile', label: 'My Profile' },
  ];

  const adminTabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/admin/themes', label: 'Themes' },
    { path: '/problem-statements', label: 'Problem Statements' },
    { path: '/admin/judge-panels', label: 'Judge Panels' },
    { path: '/admin/roster', label: 'Master Roster' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/spoc/verify', label: 'Verification Queue' },
    { path: '/admin/bootcamp', label: 'Top 50 Shortlist' },
    { path: '/profile', label: 'My Profile' },
  ];

  const spocTabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/spoc/verify', label: 'Verification Queue' },
    { path: '/admin/roster', label: 'Master Roster' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/admin/bootcamp', label: 'Top 50 Shortlist' },
    { path: '/themes', label: 'Themes' },
    { path: '/problem-statements', label: 'Problem Statements' },
    { path: '/profile', label: 'My Profile' },
  ];

  const judgeTabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/judge/evaluate', label: 'Evaluate Teams' },
    { path: '/judge/history', label: 'My Evaluations' },
    { path: '/themes', label: 'Themes' },
    { path: '/problem-statements', label: 'Problem Statements' },
    { path: '/profile', label: 'My Profile' },
  ];

  let tabs = studentTabs;
  if (profile?.role === 'admin') tabs = adminTabs;
  else if (profile?.role === 'judge') tabs = judgeTabs;
  else if (profile?.role === 'spoc') tabs = spocTabs;

  // If not authenticated, show public tabs
  if (!isAuthenticated) {
    tabs = [
      { path: '/sah', label: 'Home' },
      { path: '/themes', label: 'Themes' },
      { path: '/problem-statements', label: 'Problem Statements' },
    ];
  }

  return (
    <nav className="main-navbar">
      <div className="navbar-container">

        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}

        {/* Other Events Dropdown for Students */}
        {isAuthenticated && tabs === studentTabs && (
          <div 
            className="nav-tab" 
            ref={dropdownRef} 
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
            onClick={toggleDropdown}
          >
            Other Events
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            
            {showOtherEvents && (
              <div style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                <NavLink 
                  to="/events/project-expo" 
                  style={{ padding: '12px 16px', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}
                  onClick={() => setShowOtherEvents(false)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Project Expo <span>→</span>
                </NavLink>
                <a 
                  href="#" 
                  style={{ padding: '12px 16px', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}
                  onClick={(e) => { e.preventDefault(); window.open('https://poster-presentation.amrita.edu', '_blank'); setShowOtherEvents(false); }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Poster Presentation <span>↗</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
