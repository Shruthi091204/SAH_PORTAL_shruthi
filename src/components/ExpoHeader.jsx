import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import posterLogo from '../assets/poster.png';
import projectExpoLogo from '../assets/project_expo.png';

export default function ExpoHeader() {
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPosterMode = location.pathname.includes('/poster-presentation');

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      if (isPosterMode) {
        navigate('/events/poster-presentation/register');
      } else {
        navigate('/events/project-expo/register');
      }
    }
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
          <img src={isPosterMode ? posterLogo : projectExpoLogo} alt="SAH 2026 Logo" style={{ height: '48px', width: 'auto' }} />
          <div className="header-logo-text">
            <span className="title">{isPosterMode ? 'POSTER PRESENTATION 2026' : 'PROJECT EXPO 2026'}</span>
            <span className="subtitle">Amrita Vishwa Vidyapeetham, Chennai Campus</span>
          </div>
        </Link>

        <div className="amrita-logo-wrapper" style={{ marginLeft: 'auto', marginRight: '32px', display: 'flex', alignItems: 'center' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Amrita_Vishwa_Vidyapeetham_Logo.svg/512px-Amrita_Vishwa_Vidyapeetham_Logo.svg.png" 
            alt="Amrita Vishwa Vidyapeetham Logo" 
            title="Amrita Vishwa Vidyapeetham, Chennai Campus"
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div className="header-actions">
          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn-login-pill"
                onClick={() => navigate('/profile')}
                title={`Logged in as ${profile?.full_name || 'User'} (${profile?.role || 'student'}) — Click to view My Profile`}
                style={{ cursor: 'pointer' }}
              >
                <span>{profile?.full_name?.split(' ')[0] || 'My Profile'}</span>
                <span className="login-icon">
                  {getInitials(profile?.full_name)}
                </span>
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={signOut}
                style={{ fontSize: '0.8rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-login-pill" onClick={handleAuthClick}>
              <span>Register Now</span>
              <span className="login-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
