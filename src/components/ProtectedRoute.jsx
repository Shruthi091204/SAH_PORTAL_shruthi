import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, profile, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function checkServerAuthorization() {
      // If no specific roles required, or not authenticated yet, skip the server check
      if (roles.length === 0 || !isAuthenticated) {
        if (mounted) setIsAuthorized(true);
        return;
      }

      try {
        // Secure server-side check using RPC
        const { data, error } = await supabase.rpc('check_user_role', { required_roles: roles });
        if (error) throw error;
        
        if (mounted) setIsAuthorized(data === true);
      } catch (err) {
        console.error('Server authorization check failed:', err);
        if (mounted) setIsAuthorized(false);
      }
    }

    checkServerAuthorization();

    return () => { mounted = false; };
  }, [roles, isAuthenticated]);

  if (authLoading || isAuthorized === null) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <p style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles.length > 0 && !isAuthorized) {
    // If the server rejected the role check, redirect
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
