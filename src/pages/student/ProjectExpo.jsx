import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { downloadExpoGuidelines } from '../../utils/downloadResources';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Target,
  Zap,
  Users,
  Cpu,
  Trophy,
  ShieldCheck,
  CheckSquare,
  Download,
  FileText
} from 'lucide-react';

const expoData = {
  objectives: [
    "Showcase outstanding student projects, prototypes and technological solutions across departments.",
    "Encourage engineering innovation, problem-solving and interdisciplinary collaboration.",
    "Enable structured evaluation by faculty, researchers and external industry experts.",
    "Identify projects with potential for patenting, commercialisation, industry deployment or startup development."
  ],
  keyDates: [
    { title: "Registration Opens", dateStr: "2026-08-24", displayDate: "Mon, 24 Aug 2026", icon: <Users size={18} /> },
    { title: "Registration Closes", dateStr: "2026-08-31", displayDate: "Mon, 31 Aug 2026 (5:00 PM)", icon: <AlertTriangle size={18} /> },
    { title: "Documentation Submission", dateStr: "2026-09-05", displayDate: "Sat, 5 Sep 2026", icon: <CheckSquare size={18} /> },
    { title: "Screening & Shortlisting", dateStr: "2026-09-06", displayDate: "Sun–Mon, 6–7 Sep 2026", icon: <Target size={18} /> },
    { title: "Shortlist Announced", dateStr: "2026-09-07", displayDate: "Mon, 7 Sep 2026", icon: <Zap size={18} /> },
    { title: "Project Expo & Jury Evaluation", dateStr: "2026-09-10", displayDate: "Thu, 10 Sep 2026", icon: <Cpu size={18} /> },
    { title: "Awards & Opportunity Mapping", dateStr: "2026-09-10", displayDate: "Thu, 10 Sep 2026", icon: <Trophy size={18} /> }
  ],
  eligibility: [
    { label: "Who may apply", value: "Students of any B.Tech, M.Tech or PhD programme, in any year of study.", span: 1 },
    { label: "Team size", value: "2–3 students per project. Interdisciplinary teams across departments are strongly encouraged.", span: 1 },
    { label: "Faculty mentor", value: "Mandatory. A faculty mentor from any department must endorse the project, certifying student authorship and demonstration readiness.", span: 2 },
    { label: "Project stage", value: "Ongoing or completed, and sufficiently developed for a live demonstration before the jury.", span: 1 },
    { label: "Entries per student", value: "A student may be part of not more than two Project Expo teams.", span: 1 },
    { label: "Projects accepted", value: "Final-year, capstone and mini-projects with significant innovation; course-based projects with substantial engineering implementation; interdisciplinary projects; and independently developed student prototypes.", span: 2 }
  ],
  outputs: [
    "Hardware prototype or device", "Software application/platform", "Integrated hardware-software system",
    "Robotics or automation system", "AI/ML implementation with demo output", "IoT or cyber-physical system",
    "Validated experimental setup", "Simulation or engineering design with verified performance"
  ],
  domains: [
    "AI & Machine Learning", "Data Science & Computing", "Electronics & Embedded Systems", 
    "IoT & Cyber-Physical Systems", "Communication & Signal Processing", 
    "VLSI & Semiconductor Technologies", "Robotics & Automation", 
    "Healthcare & Biomedical Technology", "Energy & Sustainable Technologies", 
    "Advanced Materials & Nanotechnology", "Smart Manufacturing", 
    "Smart Campus Solutions", "Environmental & Social Innovation", 
    "Interdisciplinary Technologies", "Open Innovation"
  ],
  rubric: [
    { criterion: "Problem Definition & Objectives", marks: 5, color: "#3B82F6" },
    { criterion: "Design & Technical Approach", marks: 10, color: "#8B5CF6" },
    { criterion: "Build Quality & Completeness", marks: 15, color: "#F59E0B" },
    { criterion: "Live Demonstration & Performance", marks: 10, color: "#10B981" },
    { criterion: "Application Value & Scalability", marks: 5, color: "#EC4899" },
    { criterion: "Presentation & Documentation", marks: 5, color: "#6366F1" }
  ],
  awards: [
    { name: "Best Overall Project", badge: "Excellence", gradient: "linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)" },
    { name: "Best Innovation", badge: "Innovation & Engineering", gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)" },
    { name: "Best Working Prototype", badge: "Innovation & Engineering", gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)" },
    { name: "Best Technical Implementation", badge: "Innovation & Engineering", gradient: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)" },
    { name: "Best Interdisciplinary Project", badge: "Collaboration", gradient: "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)" },
    { name: "Best Industry-Relevant Project", badge: "Industry & Enterprise", gradient: "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)" },
    { name: "Best Startup Potential", badge: "Industry & Enterprise", gradient: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)" },
    { name: "Best Social Impact Project", badge: "Impact", gradient: "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)" },
    { name: "Best Sustainable Technology", badge: "Impact", gradient: "linear-gradient(135deg, #84CC16 0%, #65A30D 100%)" },
    { name: "Young Innovator Award", badge: "Emerging Talent", gradient: "linear-gradient(135deg, #C084FC 0%, #A855F7 100%)" }
  ],
  exhibitionRequirements: {
    mandatory: [
      "Project title + Project ID", "Team members & Faculty mentor", "Department",
      "Working prototype", "Short description & Key innovation", "Results & Applications"
    ],
    recommended: [
      "System architecture diagram", "Performance metrics", "QR code to demo video/repo"
    ],
    backup: "Backup demonstration required: video, screenshots, sample datasets, or recorded results — contingency only, not a substitute for live demo."
  }
};

export default function ProjectExpo() {
  const navigate = useNavigate();
  const today = new Date();
  
  const upcomingIndex = useMemo(() => {
    let nearestIdx = -1;
    let smallestDiff = Infinity;
    expoData.keyDates.forEach((item, index) => {
      const itemDate = new Date(item.dateStr);
      const diff = itemDate.getTime() - today.getTime();
      if (diff >= -86400000 && diff < smallestDiff) {
        smallestDiff = diff;
        nearestIdx = index;
      }
    });
    return nearestIdx !== -1 ? nearestIdx : expoData.keyDates.length - 1;
  }, [today]);

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div style={{ background: '#f4f7f9', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Dynamic Glassy Hero */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, var(--navy) 0%, #0f172a 100%)', 
        padding: '100px 20px', 
        color: 'white', 
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
        />

        {/* Register Now Button in Hero Right */}
        <div style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 30 }}>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/events/project-expo/register')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Register Now <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

        <motion.div relative zIndex={10} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '24px', color: 'var(--orange)', textTransform: 'uppercase' }}>
            SAH 2026 Special Track
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Project Expo
          </h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.85, lineHeight: 1.6, fontWeight: 300 }}>
            The premier demonstration-based exhibition. Showcase your existing prototypes and ongoing engineering marvels to an expert jury. No new build required.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', position: 'relative', zIndex: 20 }}>
        
        {/* 1. Objectives */}
        <motion.section id="objectives" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target color="var(--orange)" /> Objectives
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {expoData.objectives.map((obj, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--navy)', fontWeight: 500, fontSize: '1.1rem', lineHeight: 1.5 }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--orange)', borderRadius: '50%', marginTop: '10px', flexShrink: 0 }} />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* 2. Eligibility */}
        <motion.section id="eligibility" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 color="var(--orange)" /> Eligibility — Who Can Apply?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {expoData.eligibility.map((item, idx) => (
                <motion.div whileHover={{ scale: 1.01 }} key={idx} style={{ 
                  gridColumn: `span ${item.span}`,
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
                  padding: '24px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--orange)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '12px' }}>
                    {item.label}
                  </div>
                  <div style={{ color: 'var(--navy)', fontWeight: 600, lineHeight: 1.5, fontSize: '1.1rem' }}>
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 3. Project Scope */}
        <motion.section id="scope" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ background: 'var(--navy)', borderRadius: '32px', padding: '48px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px', position: 'relative', zIndex: 10 }}>Project Scope</h2>
            
            <motion.div variants={childVariants} style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', padding: '20px 24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
              <AlertTriangle color="#F87171" size={32} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#FECACA', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>Essential Condition:</strong> The project must have sufficient technical maturity for a meaningful live demonstration. Concept posters, literature surveys and video-only submissions without a functioning system will NOT be accepted.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', position: 'relative', zIndex: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Qualifying Outputs</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {expoData.outputs.map((out, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 500 }}>
                      <Zap size={14} color="var(--orange)" /> {out}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Domains (Indicative)</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {expoData.domains.map((domain, idx) => (
                    <span key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 4. Selection Process & Key Dates */}
        <motion.section id="key-dates" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar color="var(--orange)" /> Selection Process and Key Dates
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>
              The Project Expo will be held on <strong>Thursday, 10 September 2026</strong>. All deadlines close at 5.00 p.m. on the date indicated. No extensions will be granted.
            </p>
            
            <div style={{ position: 'relative', paddingLeft: '32px', maxWidth: '800px' }}>
              {/* Vertical Line */}
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, var(--orange) 0%, #e2e8f0 100%)' }} />
              
              {expoData.keyDates.map((item, index) => {
                const isUpcoming = index === upcomingIndex;
                const isPast = index < upcomingIndex;
                
                return (
                  <motion.div key={index} variants={childVariants} style={{ position: 'relative', marginBottom: index === expoData.keyDates.length - 1 ? 0 : '32px' }}>
                    {/* Timeline Dot */}
                    <div style={{ 
                      position: 'absolute', 
                      left: '-32px', 
                      top: '2px',
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: isUpcoming ? 'var(--orange)' : isPast ? '#94a3b8' : '#fff',
                      border: `3px solid ${isUpcoming ? '#fff' : isPast ? '#fff' : '#cbd5e1'}`,
                      boxShadow: isUpcoming ? '0 0 0 4px rgba(234,88,12,0.2)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isUpcoming ? '#fff' : 'transparent',
                      zIndex: 2
                    }}>
                      {isUpcoming && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }} />}
                    </div>
                    
                    <div style={{ 
                      background: isUpcoming ? 'linear-gradient(to right, #fff7ed, #ffffff)' : 'transparent',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: isUpcoming ? '1px solid #fed7aa' : '1px solid transparent',
                      transform: isUpcoming ? 'translateX(10px)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isUpcoming ? 'var(--orange)' : 'var(--navy)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                        {item.icon} {item.title}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.displayDate}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* 5. Visual Evaluation Rubric */}
        <motion.section id="rubric" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Evaluation Rubric</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Each project is evaluated out of 50 marks during the live demonstration and technical interaction.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {expoData.rubric.map((item, idx) => (
              <motion.div variants={childVariants} whileHover={{ y: -5 }} key={idx} style={{ background: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '24px', lineHeight: 1.4 }}>
                  {item.criterion}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Weightage</span>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.marks}</span>
                  </div>
                  {/* Progress bar visual */}
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: `${(item.marks / 15) * 100}%` }} 
                      transition={{ duration: 1, delay: 0.2 }}
                      style={{ height: '100%', background: item.color, borderRadius: '4px' }} 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 6. Trophy Awards Grid */}
        <motion.section id="awards" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Award Categories and Recognition</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Compete for excellence across prestigious categories. Each category carries a Winner and a Runner-Up.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {expoData.awards.map((award, idx) => (
              <motion.div variants={childVariants} whileHover={{ scale: 1.03, rotate: 1 }} key={idx} style={{ 
                background: award.gradient, 
                padding: '2px', // for border effect
                borderRadius: '20px', 
                boxShadow: '0 15px 35px -10px rgba(0,0,0,0.1)' 
              }}>
                <div style={{ background: '#fff', height: '100%', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '6px 12px', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '20px', alignSelf: 'flex-start', marginBottom: '20px' }}>
                    {award.badge}
                  </div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--navy)', fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                    {award.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', marginTop: '32px', fontSize: '0.95rem' }}>
            * One category award per project. Best Overall Project winner is ineligible for any other category. Certificates and medals for winners. E-certificates for all participants.
          </p>
        </motion.section>

        {/* 7. General Information */}
        <motion.section id="requirements" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>General Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Exhibition display</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Mandatory at the stall: project title and Project ID, team members, faculty mentor, department, the working prototype or system, a short description, key innovation, major results and applications. Recommended: system architecture diagram, key performance metrics, and a QR code linking to a demonstration video or repository.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Backup demonstration</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Every team must carry a backup — demonstration video, screenshots, sample datasets or recorded results. This is a contingency for technical failure at the venue and does not substitute for a live demonstration.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#B91C1C', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} /> Safety
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Teams must ensure safe operation of all demonstrations. Projects involving high voltage or current, batteries, motors, lasers, chemicals, biological materials, pressurised systems, heat-generating equipment, rotating machinery or sharp components must be declared at registration and cleared by the Organising Committee, which may prohibit any demonstration considered unsafe.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#15803D', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Academic integrity
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Projects must be original student work. Teams must acknowledge external resources, cite software, libraries and datasets used, declare AI-assisted development as required by institutional policy, and present no fabricated results. Misrepresentation of third-party work as student-developed will lead to disqualification.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 8. Organizing Committee & Contact */}
        <motion.section id="contact" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            {/* Organizing Committee */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>Organizing Committee</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Patron</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)' }}>Dr. V Jayakumar</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Principal, Amrita Chennai</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Project Expo – Campus SPoC</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. S. Parthasarathy</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>MECH & RAI Programme Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. Rishikumar</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>ECE & CCE Programme Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. S. Veluchamy</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>CSE Program Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. K. Ashwini</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>AI & CYS Programme Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. IR Oviya</div>
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', color: 'white', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '32px' }}>Enquiries</h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Students may approach the Programme Faculty Coordinator for their own programme in the first instance. Queries of a general nature may be sent to the Organising Committee by email.
              </p>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Official Email</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>sah@ch.amrita.edu</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 9. Guidelines and Templates */}
        <motion.section id="templates" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Download color="var(--orange)" /> Guidelines and Templates
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              
              <button 
                onClick={downloadExpoGuidelines}
                style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.2)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="var(--orange)" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Expo Guidelines</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>PDF Document (Available)</div>
                </div>
              </button>

              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ background: '#e2e8f0', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="#64748b" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>Project Info Sheet</div>
                  <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#fef3c7', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>Coming Soon</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ background: '#e2e8f0', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="#64748b" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>Software Sample</div>
                  <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#fef3c7', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>Coming Soon</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ background: '#e2e8f0', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="#64748b" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>Hardware Sample</div>
                  <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#fef3c7', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>Coming Soon</div>
                </div>
              </div>

            </div>
          </div>
        </motion.section>

        {/* Premium Floating CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          style={{ 
            position: 'sticky', 
            bottom: '32px', 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(16px)',
            padding: '24px 32px', 
            borderRadius: '24px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.5)',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.5rem', fontWeight: 800 }}>Ready to showcase your project?</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
              Secure your spot at the SAH 2026 Project Expo today.<br/>
              <strong style={{color: 'var(--orange)'}}>Note: Only the Team Leader needs to register on behalf of the entire team.</strong>
            </p>
          </div>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/events/project-expo/register')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', padding: '16px 40px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Register Now <ChevronRight size={20} strokeWidth={3} />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
