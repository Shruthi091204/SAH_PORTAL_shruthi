import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showOtherEvents, setShowOtherEvents] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);
  const [activeHash, setActiveHash] = useState(location.hash);

  useEffect(() => {
    setActiveHash(location.hash);
  }, [location.hash]);

  // Intersection observer for sections on /sah and /events/project-expo
  useEffect(() => {
    if (location.pathname !== '/sah' && location.pathname !== '/' && location.pathname !== '/events/project-expo') return;

    let timeout;
    const observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let mostVisible = '';

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisible = entry.target.id;
        }
      });

      if (mostVisible) {
        setActiveHash('#' + mostVisible);
      } else {
        // If we scroll to the very top, clear hash
        if (window.scrollY < 200) {
          setActiveHash('');
        }
      }
    }, {
      rootMargin: '-100px 0px -40% 0px',
      threshold: [0, 0.1, 0.5, 1]
    });

    timeout = setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(s => observer.observe(s));
    }, 500);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [location.pathname]);

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
        top: (rect.bottom + 4) + 'px',
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

  const handleNavClick = (e, path) => {
    const [pathname, hash] = path.split('#');
    
    // If the path is /sah and we are at /, let the router navigate to /sah, but we might want to navigate manually to handle hashes.
    // Actually NavLink will handle navigating across pages. 
    // We only intercept if we are already on the target page and just need to scroll.
    const currentPath = location.pathname === '/' ? '/sah' : location.pathname;
    const targetPath = pathname === '/' ? '/sah' : pathname;
    
    if (hash && currentPath === targetPath) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        const offset = 80; // approximate navbar height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        setActiveHash('#' + hash);
        window.history.pushState(null, '', path);
      }
    } else if (!hash && currentPath === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveHash('');
      window.history.pushState(null, '', path);
    }
  };

  // Navbar is now visible on auth pages because they are integrated into the layout

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

  const isExpoPage = location.pathname === '/events/project-expo';

  if (isExpoPage) {
    tabs = [
      { path: '/events/project-expo', label: 'Expo Home' },
      { path: '/events/project-expo#objectives', label: 'Objectives' },
      { path: '/events/project-expo#eligibility', label: 'Eligibility' },
      { path: '/events/project-expo#scope', label: 'Project Scope' },
      { path: '/events/project-expo#key-dates', label: 'Key Dates' },
      { path: '/events/project-expo#rubric', label: 'Rubric' },
      { path: '/events/project-expo#awards', label: 'Awards' },
      { path: '/events/project-expo#requirements', label: 'Requirements' },
      { path: '/events/project-expo#contact', label: 'Contact' }
    ];
  } else if (!isAuthenticated) {
    tabs = [
      { path: '/sah', label: 'Home' },
      { path: '/themes', label: 'Themes' },
      { path: '/problem-statements', label: 'Problem Statements' },
      { path: '/sah#objectives', label: 'Objectives' },
      { path: '/sah#eligibility', label: 'Eligibility' },
      { path: '/sah#key-dates', label: 'Key Dates' },
      { path: '/sah#rubric', label: 'Evaluation Rubric' },
      { path: '/sah#awards', label: 'Awards' },
      { path: '/sah#requirements', label: 'General Guidelines' },
      { path: '/sah#contact', label: 'Contact' },
    ];
  }

  return (
    <nav className="main-navbar">
      <div className="navbar-container">

        {tabs.map(tab => {
          const [pathBase, hash] = tab.path.split('#');
          const currentPath = location.pathname === '/' ? '/sah' : location.pathname;
          const targetPath = pathBase === '/' ? '/sah' : pathBase;
          
          let isActiveTab = false;
          if (currentPath === targetPath) {
            if (hash) {
              isActiveTab = activeHash === '#' + hash;
            } else {
              isActiveTab = !activeHash || activeHash === '';
            }
          }

          const navItem = (
            <NavLink
              key={tab.path}
              to={tab.path}
              onClick={(e) => handleNavClick(e, tab.path)}
              className={() => `nav-tab ${isActiveTab ? 'active' : ''}`}
            >
              {tab.label}
            </NavLink>
          );

          if (isExpoPage && tab.path === '/events/project-expo') {
            return (
              <>
                {navItem}
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
                      <NavLink 
                        to="/events/poster-presentation" 
                        style={{ padding: '12px 16px', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}
                        onClick={() => setShowOtherEvents(false)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        Poster Presentation <span>→</span>
                      </NavLink>
                    </div>
                  )}
                </div>
              </>
            );
          }

          return navItem;
        })}

        {/* Other Events Dropdown for Students when not on Expo page */}
        {!isExpoPage && isAuthenticated && tabs === studentTabs && (
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
                <NavLink 
                  to="/events/poster-presentation" 
                  style={{ padding: '12px 16px', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}
                  onClick={() => setShowOtherEvents(false)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Poster Presentation <span>→</span>
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
