import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  CheckSquare
} from 'lucide-react';

const expoData = {
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
    { label: "Who may apply", value: "B.Tech / M.Tech / PhD, any year", span: 1 },
    { label: "Team size", value: "2–3 students, interdisciplinary encouraged", span: 1 },
    { label: "Application Process", value: "Only the Team Leader needs to apply for the event on behalf of the entire team.", span: 2 },
    { label: "Faculty mentor", value: "Mandatory, must endorse project", span: 1 },
    { label: "Entries per student", value: "Max 2 teams", span: 1 },
    { label: "Project stage", value: "Ongoing or completed, demo-ready", span: 2 },
    { label: "Accepted Work", value: "Final-year/capstone/mini-projects, course projects with real engineering depth, interdisciplinary, independent prototypes", span: 2 }
  ],
  outputs: [
    "Hardware prototype", "Software app/platform", "Hardware+software system",
    "Robotics/automation", "AI/ML with demo output", "IoT/cyber-physical system",
    "Validated experimental setup", "Simulation with verified performance"
  ],
  domains: [
    "AI & ML", "Data Science & Computing", "Electronics & Embedded Systems", 
    "IoT & Cyber-Physical Systems", "Communication & Signal Processing", 
    "VLSI & Semiconductor Tech", "Robotics & Automation", 
    "Healthcare & Biomedical Tech", "Energy & Sustainable Tech", 
    "Advanced Materials & Nanotech", "Smart Manufacturing", 
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
    { name: "Best Innovation", badge: "Innovation", gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)" },
    { name: "Best Working Prototype", badge: "Engineering", gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)" },
    { name: "Best Technical Implementation", badge: "Engineering", gradient: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)" },
    { name: "Best Interdisciplinary Project", badge: "Collaboration", gradient: "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)" },
    { name: "Best Industry-Relevant Project", badge: "Enterprise", gradient: "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)" },
    { name: "Best Startup Potential", badge: "Enterprise", gradient: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)" },
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

      <div style={{ maxWidth: '1200px', margin: '-60px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          
          {/* Creative Timeline (Left Column) */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar color="var(--orange)" /> Key Dates
            </h2>
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
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
          </motion.div>

          {/* Bento Grid Eligibility (Right Column) */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', height: '100%' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 color="var(--orange)" /> Eligibility Criteria
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {expoData.eligibility.map((item, idx) => (
                  <motion.div whileHover={{ scale: 1.02 }} key={idx} style={{ 
                    gridColumn: `span ${item.span}`,
                    background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
                    padding: '20px', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--orange)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '8px' }}>
                      {item.label}
                    </div>
                    <div style={{ color: 'var(--navy)', fontWeight: 600, lineHeight: 1.4, fontSize: '1rem' }}>
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Dynamic Project Scope */}
        <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '60px' }}>
          <div style={{ background: 'var(--navy)', borderRadius: '32px', padding: '48px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px', position: 'relative', zIndex: 10 }}>Project Scope & Domains</h2>
            
            <motion.div variants={childVariants} style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', padding: '20px 24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
              <AlertTriangle color="#F87171" size={32} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#FECACA', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>Strict Warning:</strong> Concept posters, literature surveys, and video-only submissions without a functioning system will NOT be accepted.
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
                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Eligible Domains</h3>
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

        {/* Visual Evaluation Rubric */}
        <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Evaluation Rubric</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>How your project will be scored by the jury (Total: 50 Marks)</p>
          
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

        {/* Trophy Awards Grid */}
        <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Award Categories</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Compete for excellence across 10 prestigious categories.</p>
          
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
            * One category award per project. Best Overall Project winner is ineligible for any other category. Jury decision is final.
          </p>
        </motion.section>

        {/* Requirements & Safety Container */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '80px' }}>
          
          {/* Exhibition Requirements */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>Stall Requirements</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ color: '#3B82F6', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={20} /> Mandatory</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {expoData.exhibitionRequirements.mandatory.map((req, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--navy)', fontWeight: 500 }}>
                    <div style={{ width: '6px', height: '6px', background: '#3B82F6', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#10B981', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={20} /> Recommended</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {expoData.exhibitionRequirements.recommended.map((req, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--navy)', fontWeight: 500 }}>
                    <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ marginTop: '32px', background: '#FFF7ED', border: '1px dashed #F97316', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', color: '#9A3412', lineHeight: 1.6 }}>
              <strong>Backup Plan:</strong> {expoData.exhibitionRequirements.backup}
            </div>
          </motion.div>

          {/* Safety & Integrity */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>Safety & Integrity</h2>
            
            <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#FEF2F2', padding: '24px', borderRadius: '16px', borderLeft: '6px solid #EF4444', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#FEE2E2', padding: '8px', borderRadius: '50%' }}>
                  <ShieldAlert color="#DC2626" size={24} />
                </div>
                <h4 style={{ margin: 0, color: '#991B1B', fontSize: '1.2rem', fontWeight: 800 }}>Safety Clearance</h4>
              </div>
              <p style={{ margin: 0, color: '#B91C1C', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                High voltage/current, batteries, motors, lasers, chemicals, biological materials, pressurised systems, heat-generating equipment, rotating machinery, or sharp components must be declared at registration and cleared by the Organising Committee.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', borderLeft: '6px solid #22C55E', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#DCFCE7', padding: '8px', borderRadius: '50%' }}>
                  <ShieldCheck color="#16A34A" size={24} />
                </div>
                <h4 style={{ margin: 0, color: '#166534', fontSize: '1.2rem', fontWeight: 800 }}>Academic Integrity</h4>
              </div>
              <p style={{ margin: 0, color: '#15803D', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                Original student work only. You must cite external software, libraries, and datasets, and declare any AI-assisted development. Fabricated results or misrepresentation will lead to immediate disqualification.
              </p>
            </motion.div>
          </motion.div>

        </div>

        {/* Organizing Committee & Contact */}
        <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            {/* Organizing Committee */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>Organizing Committee</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Patron</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)' }}>Dr. V Jeyakumar</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Principal, Amrita Chennai</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Project Expo Coordinators</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>Dr. Parthasarathy</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. Ravishankar Simhadri</div>
              </div>
            </div>

            {/* Contact & Support */}
            <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', color: 'white', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '32px' }}>Need Help?</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Student Core Team</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Vishal P</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Contact details to be updated shortly</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Official Support</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Research Cell</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Contact details to be updated shortly</div>
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
