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
import { downloadPPTTemplate, downloadGuidelines, downloadExpoGuidelines, downloadPosterGuidelines } from './utils/downloadResources';
import flowchart from './assets/FLOWCHART.png';
import vJeyakumarImg from './assets/V_jeyakumar.jpg';

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
import PosterPresentation from './pages/student/PosterPresentation';
import PosterPresentationRegister from './pages/student/PosterPresentationRegister';
import ProjectExpoRegister from './pages/student/ProjectExpoRegister';
import ThemesPage from './pages/ThemesPage';
import EventLandingPage from './pages/EventLandingPage';
import PortalHubPage from './pages/PortalHubPage';
import ProblemStatementsPage from './pages/ProblemStatementsPage';
import SahHomePage from './pages/SahHomePage';
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
    <div style={{ backgroundColor: '#030303', minHeight: '100vh', color: '#ffffff', paddingBottom: '80px' }}>
      <EventLandingPage onEnter={handleScrollDown} />
      <div ref={scrollRef}>
        <ConnoisseurStackInteractor />
      </div>

      {/* Global Events Downloads (Futuristic Vibe) */}
      <section className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-24">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-14 shadow-2xl">
          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
                ✦ Official Resources
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                EVENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">GUIDELINES</span>
              </h3>
            </div>
            <p className="text-zinc-400 font-medium max-w-sm text-sm md:text-base leading-relaxed text-center md:text-right">
              Download the official rulebooks and constraints for all Chronicles of Innovation arenas. Preparation is the first step to victory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hackathon */}
            <button 
              onClick={downloadGuidelines}
              className="group relative overflow-hidden bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 rounded-2xl p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.3)]"
            >
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h4 className="text-white font-bold text-2xl mb-3 tracking-tight">SAH Hackathon</h4>
              <p className="text-zinc-500 text-sm font-medium mb-12">Complete rulebook & scoring rubric</p>
              <div className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                Download PDF <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </div>
            </button>

            {/* Expo */}
            <button 
              onClick={downloadExpoGuidelines}
              className="group relative overflow-hidden bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 rounded-2xl p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.3)]"
            >
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h4 className="text-white font-bold text-2xl mb-3 tracking-tight">Project Expo</h4>
              <p className="text-zinc-500 text-sm font-medium mb-12">Display constraints & evaluation</p>
              <div className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                Download PDF <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </div>
            </button>

            {/* Poster */}
            <button 
              onClick={downloadPosterGuidelines}
              className="group relative overflow-hidden bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 rounded-2xl p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.3)]"
            >
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h4 className="text-white font-bold text-2xl mb-3 tracking-tight">Poster Track</h4>
              <p className="text-zinc-500 text-sm font-medium mb-12">A0 specifications & layout guide</p>
              <div className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                Download PDF <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </div>
            </button>
            
          </div>
        </div>
      </section>

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
        <Route path="/login" element={<LoginPage />} />

        {/* Events Dedicated Layout (Project Expo & Poster Presentation) */}
        <Route path="/events/*" element={
          <>
            <ExpoAnnouncementBanner />
            <ExpoHeader />
            <ExpoNavbar />
            <Routes>
              {/* Project Expo */}
              <Route path="project-expo" element={<ProjectExpo />} />
              <Route path="project-expo/register" element={<ProjectExpoRegister />} />
              
              {/* Poster Presentation */}
              <Route path="poster-presentation" element={<PosterPresentation />} />
              <Route path="poster-presentation/register" element={<PosterPresentationRegister />} />
              <Route path="*" element={
                <div className="page-container">
                  <div className="empty-state">
                    <div className="empty-icon"></div>
                    <h3>Page Not Found</h3>
                    <p>The events page you're looking for doesn't exist.</p>
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
