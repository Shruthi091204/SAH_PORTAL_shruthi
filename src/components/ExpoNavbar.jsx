import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ExpoNavbar() {
  const { isAuthenticated, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
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

  // Navbar is now visible on auth pages because they are integrated into the layout

  let tabs = [
    { path: '/events/project-expo', label: 'Expo Home', exact: true }
  ];

  return (
    <nav className="main-navbar">
      <div className="navbar-container">

        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.exact}
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}

        {/* Other Events Dropdown to go back to SAH */}
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
