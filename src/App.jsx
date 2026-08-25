import { useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AnnouncementBanner from './components/AnnouncementBanner';
import ExpoAnnouncementBanner from './components/ExpoAnnouncementBanner';
import Header from './components/Header';
import ExpoHeader from './components/ExpoHeader';
import Navbar from './components/Navbar';
import ExpoNavbar from './components/ExpoNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';


// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TeamMarketplace from './pages/TeamMarketplace';
import MyTeamPage from './pages/MyTeamPage';
import CreateTeamPage from './pages/CreateTeamPage';
import ProfilePage from './pages/ProfilePage';
import ProjectExpo from './pages/student/ProjectExpo';
import ProjectExpoRegister from './pages/student/ProjectExpoRegister';
import ThemesPage from './pages/ThemesPage';
import EventLandingPage from './pages/EventLandingPage';
import PortalHubPage from './pages/PortalHubPage';
import ProblemStatementsPage from './pages/ProblemStatementsPage';
import { ConnoisseurStackInteractor } from './components/ui/connoisseur-stack-interactor';

// Admin Pages
import ThemesAdmin from './pages/admin/ThemesAdmin';
import JudgePanelsAdmin from './pages/admin/JudgePanelsAdmin';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import MasterRoster from './pages/admin/MasterRoster';
import BootcampShortlist from './pages/admin/BootcampShortlist';

// Judge Pages
import EvaluationPage from './pages/judge/EvaluationPage';
import EvaluationHistory from './pages/judge/EvaluationHistory';

// SPOC Pages
import VerificationQueue from './pages/spoc/VerificationQueue';

import SahHomePage from './pages/SahHomePage';

function CombinedLandingHub() {
  const { isAuthenticated } = useAuth();
  const scrollRef = useRef(null);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleScrollDown = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#030303', minHeight: '100vh', color: '#ffffff' }}>
      <EventLandingPage onEnter={handleScrollDown} />
      <div ref={scrollRef}>
        <ConnoisseurStackInteractor />
      </div>
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<CombinedLandingHub />} />
        <Route path="/hub" element={<Navigate to="/" replace />} />
        {/* Auth pages — no banner/header/navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Project Expo Dedicated Layout */}
        <Route path="/events/project-expo/*" element={
          <>
            <ExpoAnnouncementBanner />
            <ExpoHeader />
            <ExpoNavbar />
            <Routes>
              <Route path="/" element={<ProtectedRoute><ProjectExpo /></ProtectedRoute>} />
              <Route path="/register" element={<ProtectedRoute><ProjectExpoRegister /></ProtectedRoute>} />
              <Route path="*" element={
                <div className="page-container">
                  <div className="empty-state">
                    <div className="empty-icon"></div>
                    <h3>Page Not Found</h3>
                    <p>The page you're looking for doesn't exist in Project Expo.</p>
                  </div>
                </div>
              } />
            </Routes>
            <Footer />
          </>
        } />

        {/* All other pages with Hackathon layout */}
        <Route path="*" element={
          <>
            <AnnouncementBanner />
            <Header />
            <Navbar />
            <Routes>
              {/* Public */}
              <Route path="/sah" element={<SahHomePage />} />
              <Route path="/themes" element={<ThemesPage />} />
              <Route path="/problem-statements" element={<ProblemStatementsPage />} />

              {/* Student / Team Leader */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><TeamMarketplace /></ProtectedRoute>} />
              <Route path="/my-team" element={<ProtectedRoute><MyTeamPage /></ProtectedRoute>} />
              <Route path="/create-team" element={<ProtectedRoute><CreateTeamPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Admin & SPOC Shared Management */}
              <Route path="/admin/themes" element={<ProtectedRoute roles={['admin', 'spoc']}><ThemesAdmin /></ProtectedRoute>} />
              <Route path="/admin/judge-panels" element={<ProtectedRoute roles={['admin']}><JudgePanelsAdmin /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin', 'spoc']}><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/admin/roster" element={<ProtectedRoute roles={['admin', 'spoc']}><MasterRoster /></ProtectedRoute>} />
              <Route path="/admin/bootcamp" element={<ProtectedRoute roles={['admin', 'spoc']}><BootcampShortlist /></ProtectedRoute>} />
              <Route path="/spoc/verify" element={<ProtectedRoute roles={['spoc', 'admin']}><VerificationQueue /></ProtectedRoute>} />

              {/* Judge */}
              <Route path="/judge/evaluate" element={<ProtectedRoute roles={['judge', 'admin']}><EvaluationPage /></ProtectedRoute>} />
              <Route path="/judge/history" element={<ProtectedRoute roles={['judge', 'admin']}><EvaluationHistory /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={
                <div className="page-container">
                  <div className="empty-state">
                    <div className="empty-icon"></div>
                    <h3>Page Not Found</h3>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              } />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </>
  );
}
