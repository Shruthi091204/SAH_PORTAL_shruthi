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


function SahHomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="hero-banner" style={{ marginTop: '0' }}>
        <h1>Smart Amrita Hackathon 2026</h1>
        <p>Amrita Vishwa Vidyapeetham, Chennai Campus — Innovating India, Solving National Challenges</p>
      </div>

      {/* What is SAH */}
      <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
        <h2 style={{ marginBottom: '12px' }}>What is SAH 2026?</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          Smart Amrita Hackathon (SAH) 2026 is an internal hackathon organized by
          Amrita Vishwa Vidyapeetham, Chennai Campus to prepare and shortlist the
          best student teams for the National Smart India Hackathon (SIH) 2026.
          Students form teams of 6, choose themes from government
          ministries and organizations, and develop innovative solutions. The top 50
          teams will be selected through a rigorous evaluation process including
          Z-Score normalized judging, and will participate in an intensive bootcamp
          before being submitted to the national SIH portal.
        </p>
      </div>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        {/* Header Pill */}
        <div className="flowchart-header">
          <span className="flowchart-pill">HOW IT WORKS</span>
        </div>

        {/* 3 Steps Row */}
        <div className="how-it-works-grid">
          {[
            {
              step: '01',
              colorTheme: 'step-orange',
              title: 'Register & Form a Team',
              desc: 'Sign up with your Amrita Chennai Roll ID and create or join a 6-member team.'
            },
            {
              step: '02',
              colorTheme: 'step-navy',
              title: 'Choose Problem',
              desc: 'Select an official theme and start developing your prototype.'
            },
            {
              step: '03',
              colorTheme: 'step-green',
              title: 'Lock & Submit',
              desc: 'Lock your team (min 1 female member) and submit solution PPT & GitHub links for SPOC verification.'
            }
          ].map((item, i) => (
            <div key={i} className={`how-it-works-column ${item.colorTheme}`}>
              {/* Step Card */}
              <div className="how-it-works-card">
                {/* Circular Badge */}
                <div className="how-it-works-badge">{item.step}</div>

                {/* Content */}
                <h4 className="how-it-works-title">{item.title}</h4>
                <p className="how-it-works-desc">{item.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* SAH Logo Showcase */}
      <div className="sah-logo-showcase">
        <img src={flowchart} alt="Smart Amrita Hackathon 2026" className="sah-logo-img" />
      </div>

      {/* Organizing Committee */}
      <section style={{ padding: '80px 20px', background: '#f4f7f9', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center', letterSpacing: '-0.03em' }}>Organizing Committee</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '50px', fontSize: '1.1rem' }}>The dedicated team behind SAH 2026</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Card 1: Patron & SPOC */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
              
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Patron</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)' }}>Dr. V Jayakumar</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Principal, Amrita Chennai</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Single Point of Contact</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)' }}>Dr. Piyush Pratap Singh</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Smart India Hackathon 2026</div>
              </div>
            </div>

            {/* Card 2: Coordinators */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
              
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Department Co-Ordinators</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { name: 'Dr. Nivethitha', dept: 'CSE AI, AI/DS' },
                    { name: 'Dr. S. Krishnakumar', dept: 'CSE' },
                    { name: 'Dr. J.V. Aravind', dept: 'CSE CYS' },
                    { name: 'Dr. Ravishankar Simhadri', dept: 'ECE and CCE' },
                    { name: 'Dr. Piyush Pratap Singh', dept: 'MEE ARE RAI' }
                  ].map((faculty, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '2px' }}>{faculty.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{faculty.dept}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Contact: To be shared shortly</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Student Core Team */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
              
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Student Core Team</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    'Kutralingam A', 
                    'K L Vishnu Kamesh', 
                    'Shruthika Rajan', 
                    'Vishal P'
                  ].map((name, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '2px' }}>{name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Contact: To be shared shortly</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Rubric and Downloads */}
      <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="flowchart-header">
          <span className="flowchart-pill" style={{ background: 'var(--navy)', color: '#fff' }}>EVALUATION & RESOURCES</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
          
          {/* Rubric */}
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>📋</span> Evaluation Rubric
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Understanding of Problem', marks: 5 },
                { title: 'Innovation & Novelty', marks: 10 },
                { title: 'Technical Feasibility', marks: 10 },
                { title: 'Prototype / Implementation', marks: 15 },
                { title: 'Impact / Commercial Viability', marks: 5 },
                { title: 'Presentation & UI/UX', marks: 5 }
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px dashed var(--border-light)' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--orange)' }}>{item.marks} marks</span>
                </li>
              ))}
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '1.1rem' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>Total</span>
                <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>50 marks</span>
              </li>
            </ul>
          </div>

          {/* Downloads */}
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
             <h3 style={{ color: 'var(--navy)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>⬇️</span> Resources & Downloads
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Download the official templates and guidelines required for the Smart Amrita Hackathon 2026 submissions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={downloadPPTTemplate}
                style={{ background: 'var(--orange)', color: '#fff', padding: '16px 20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#e65c00'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--orange)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Official PPT Template (.pptx)
              </button>
              
              <button 
                onClick={downloadGuidelines}
                style={{ background: '#f8fafc', color: 'var(--navy)', padding: '16px 20px', borderRadius: '12px', border: '2px solid var(--border-light)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'border-color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--navy)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                SAH Rulebook & Guidelines (.pdf)
              </button>
            </div>
          </div>
          
        </div>
      </section>


    </div>
  );
}

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
              <Route path="login" element={<LoginPage />} />
              
              {/* Poster Presentation */}
              <Route path="poster-presentation" element={<ProtectedRoute><PosterPresentation /></ProtectedRoute>} />
              <Route path="poster-presentation/register" element={
                <div className="page-container"><div className="empty-state"><h3>Registration form coming soon</h3></div></div>
              } />
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
              <Route path="/login" element={<LoginPage />} />
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
