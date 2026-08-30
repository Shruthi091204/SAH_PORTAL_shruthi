import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'join_request': return '📩';
      case 'request_accepted': return '✅';
      case 'request_declined': return '❌';
      case 'team_invite': return '🤝';
      case 'invite_accepted': return '🎉';
      case 'invite_declined': return '😔';
      case 'team_locked': return '🔒';
      case 'team_verified': return '✔️';
      default: return '📢';
    }
  };

  // Determine the navigation target for actionable notifications
  const getNotifAction = (notif) => {
    switch (notif.type) {
      case 'team_invite':
        return { label: 'View Invitation →', path: '/dashboard' };
      case 'join_request':
        return { label: 'Review Request →', path: '/my-team' };
      case 'request_accepted':
      case 'invite_accepted':
        return { label: 'View Team →', path: '/my-team' };
      default:
        return null;
    }
  };

  const handleNotifClick = (notif) => {
    if (!notif.is_read) markAsRead(notif.id);

    const action = getNotifAction(notif);
    if (action) {
      setIsOpen(false);
      navigate(action.path);
    }
  };

  return (
    <div className="notification-bell-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <span className="bell-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </span>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty">
              <p>🔔 No notifications yet</p>
            </div>
          ) : (
            notifications.map(notif => {
              const action = getNotifAction(notif);
              return (
                <div
                  key={notif.id}
                  className={`notification-item ${!notif.is_read ? 'unread' : ''} ${action ? 'actionable' : ''}`}
                  onClick={() => handleNotifClick(notif)}
                  style={action ? { cursor: 'pointer' } : undefined}
                >
                  <div className="notif-title">
                    {getNotifIcon(notif.type)} {notif.title}
                  </div>
                  <div className="notif-message">{notif.message}</div>
                  {action && (
                    <div className="notif-action" style={{
                      marginTop: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--orange, #ff6b35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {action.label}
                    </div>
                  )}
                  <div className="notif-time">{formatTime(notif.created_at)}</div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
