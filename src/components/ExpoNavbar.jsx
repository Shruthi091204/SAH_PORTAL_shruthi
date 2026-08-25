import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ExpoNavbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showOtherEvents, setShowOtherEvents] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);
  const [activeHash, setActiveHash] = useState(location.hash);

  useEffect(() => {
    setActiveHash(location.hash);
  }, [location.hash]);

  // Intersection observer for sections on /events/* pages
  useEffect(() => {
    if (!location.pathname.startsWith('/events/')) return;

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
        if (window.scrollY < 200) {
          setActiveHash('');
        }
      }
    }, {
      rootMargin: '-100px 0px -40% 0px',
      threshold: [0, 0.1, 0.5, 1]
    });

    timeout = setTimeout(() => {
      const sections = document.querySelectorAll('section[id], div[id="requirements"]');
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
    
    const currentPath = location.pathname.replace(/\/$/, '');
    const targetPath = pathname.replace(/\/$/, '');
    
    if (hash && currentPath === targetPath) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
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

  if (['/login', '/register'].includes(location.pathname)) return null;

  const isPosterMode = location.pathname.startsWith('/events/poster-presentation');

  const tabs = isPosterMode ? [
    { path: '/events/poster-presentation', label: 'Poster Home' },
    { path: '/events/poster-presentation#objectives', label: 'Objectives' },
    { path: '/events/poster-presentation#eligibility', label: 'Eligibility' },
    { path: '/events/poster-presentation#scope', label: 'Poster Scope' },
    { path: '/events/poster-presentation#key-dates', label: 'Key Dates' },
    { path: '/events/poster-presentation#specifications', label: 'Specifications' },
    { path: '/events/poster-presentation#rubric', label: 'Rubric' },
    { path: '/events/poster-presentation#awards', label: 'Awards' },
    { path: '/events/poster-presentation#general', label: 'General Info' },
    { path: '/events/poster-presentation#contact', label: 'Contact' }
  ] : [
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

  return (
    <nav className="main-navbar">
      <div className="navbar-container">

        {tabs.map((tab, idx) => {
          const [pathBase, hash] = tab.path.split('#');
          const currentPath = location.pathname.replace(/\/$/, '');
          const targetPath = pathBase.replace(/\/$/, '');
          
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

          if (idx === 0) {
            return (
              <React.Fragment key={tab.path + "_frag"}>
                {navItem}
                
                {/* Other Events Dropdown */}
                {isAuthenticated && (
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
                          to="/dashboard" 
                          style={{ padding: '12px 16px', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}
                          onClick={() => setShowOtherEvents(false)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          Internal Hackathon <span>→</span>
                        </NavLink>
                        {isPosterMode ? (
                          <NavLink 
                            to="/events/project-expo" 
                            style={{ padding: '12px 16px', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}
                            onClick={() => setShowOtherEvents(false)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            Project Expo <span>→</span>
                          </NavLink>
                        ) : (
                          <NavLink 
                            to="/events/poster-presentation" 
                            style={{ padding: '12px 16px', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}
                            onClick={() => setShowOtherEvents(false)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            Poster Presentation <span>→</span>
                          </NavLink>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          }

          return navItem;
        })}

      </div>
    </nav>
  );
}
