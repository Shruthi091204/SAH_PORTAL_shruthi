import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  downloadPosterGuidelines, 
  downloadPosterTemplate, 
  downloadPosterHardwareSample, 
  downloadPosterSoftwareSample 
} from '../../utils/downloadResources';
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

const posterData = {
  objectives: [
    "Provide a platform for students and research scholars to present project, laboratory and research outcomes.",
    "Develop the ability to communicate technical work concisely and defend it before an expert panel.",
    "Recognise original student contribution, including work not suited to live demonstration.",
    "Identify work with potential for publication, patenting or further research support."
  ],
  keyDates: [
    { title: "Call for Posters & Registration Opens", dateStr: "2026-08-24", displayDate: "Mon, 24 Aug 2026", icon: <Users size={18} /> },
    { title: "Registration Closes", dateStr: "2026-09-03", displayDate: "Thu, 3 Sep 2026 (5:00 PM)", icon: <AlertTriangle size={18} /> },
    { title: "Poster Submission", dateStr: "2026-09-05", displayDate: "Sat, 5 Sep 2026", icon: <CheckSquare size={18} /> },
    { title: "Screening & Shortlisting", dateStr: "2026-09-06", displayDate: "Sun–Mon, 6–7 Sep 2026", icon: <Target size={18} /> },
    { title: "Announcement of Shortlist", dateStr: "2026-09-07", displayDate: "Mon, 7 Sep 2026", icon: <Zap size={18} /> },
    { title: "Poster Presentation & Jury Evaluation", dateStr: "2026-09-10", displayDate: "Thu, 10 Sep 2026", icon: <Cpu size={18} /> },
    { title: "Awards & Opportunity Mapping", dateStr: "2026-09-10", displayDate: "Thu, 10 Sep 2026", icon: <Trophy size={18} /> }
  ],
  eligibility: [
    { label: "Who may apply", value: <>Students of any B.Tech, M.Tech or PhD programme, in any year of study.</>, span: 1 },
    { label: "Mode of entry", value: <>Individual. Each poster carries a <strong style={{ color: 'var(--orange)' }}>single author</strong>; there are no teams in this category.</>, span: 1 },
    { label: "Faculty mentor / guide", value: <><strong style={{ color: 'var(--orange)' }}>Mandatory.</strong> A faculty mentor or research guide must endorse the entry, certifying authorship and originality.</>, span: 2 },
    { label: "Entries per student", value: <><strong style={{ color: 'var(--orange)' }}>One poster</strong> per student.</>, span: 1 },
    { label: "Stage of work", value: <>Completed, or sufficiently advanced to present a defensible result.</>, span: 1 },
    { label: "Registration", value: <><strong style={{ color: 'var(--orange)' }}>Free.</strong> No registration fee is charged for any SAH 2026 category.</>, span: 2 }
  ],
  outputs: [
    "A mini, capstone or design project",
    "Laboratory or experimental work extended beyond the prescribed exercise",
    "Work carried out under a funded or institutional research project",
    "A research paper published, accepted or under review",
    "An M.Tech or PhD research outcome",
    "Internship or industry project work with written permission",
    "Independent design, analysis or replication study with original results"
  ],
  domains: [
    "T1: Smart Manufacturing and Industry 5.0", 
    "T2: Robotics, Drones and Autonomous Systems",
    "T3: AI and Applied Machine Learning", 
    "T4: Data Science, Analytics and Decision Intelligence", 
    "T5: Cyber Security, Privacy and Trusted Computing", 
    "T6: Next-Generation Communication, IoT and Embedded Systems", 
    "T7: Energy, Sustainability and Climate Action", 
    "T8: Healthcare, Biomedical and Assistive Technology", 
    "T9: Smart Infrastructure, Mobility and Transportation", 
    "T10: Social Innovation, Inclusive and Educational Technology"
  ],
  rubric: [
    { criterion: "Problem Definition & Objectives", marks: 5, color: "#3B82F6" },
    { criterion: "Originality & Own Contribution", marks: 10, color: "#8B5CF6" },
    { criterion: "Technical Content & Methodology", marks: 10, color: "#F59E0B" },
    { criterion: "Results, Validation & Outcome", marks: 10, color: "#10B981" },
    { criterion: "Poster Design & Visual Communication", marks: 5, color: "#EC4899" },
    { criterion: "Presentation & Response to Jury", marks: 10, color: "#6366F1" }
  ],
  awards: [
    { name: "Smart Manufacturing and Industry 5.0", badge: "Track T1", gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)" },
    { name: "Robotics, Drones and Autonomous Systems", badge: "Track T2", gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)" },
    { name: "AI and Applied Machine Learning", badge: "Track T3", gradient: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)" },
    { name: "Data Science, Analytics and Decision Intelligence", badge: "Track T4", gradient: "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)" },
    { name: "Cyber Security, Privacy and Trusted Computing", badge: "Track T5", gradient: "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)" },
    { name: "Next-Gen Communication, IoT & Embedded", badge: "Track T6", gradient: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)" },
    { name: "Energy, Sustainability and Climate Action", badge: "Track T7", gradient: "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)" },
    { name: "Healthcare, Biomedical & Assistive Tech", badge: "Track T8", gradient: "linear-gradient(135deg, #84CC16 0%, #65A30D 100%)" },
    { name: "Smart Infrastructure, Mobility & Transport", badge: "Track T9", gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" },
    { name: "Social Innovation & Educational Tech", badge: "Track T10", gradient: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)" },
    { name: "Postgraduate Research Excellence", badge: "M.Tech Cohort", gradient: "linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)" },
    { name: "Doctoral Research Excellence", badge: "PhD Cohort", gradient: "linear-gradient(135deg, #C084FC 0%, #9333EA 100%)" },
    { name: "Emerging Researcher Award", badge: "1st Year Cohort", gradient: "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)" }
  ]
};

export default function PosterPresentation() {
  const navigate = useNavigate();
  const today = new Date();
  
  const upcomingIndex = useMemo(() => {
    let nearestIdx = -1;
    let smallestDiff = Infinity;
    posterData.keyDates.forEach((item, index) => {
      const itemDate = new Date(item.dateStr);
      const diff = itemDate.getTime() - today.getTime();
      if (diff >= -86400000 && diff < smallestDiff) {
        smallestDiff = diff;
        nearestIdx = index;
      }
    });
    return nearestIdx !== -1 ? nearestIdx : posterData.keyDates.length - 1;
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
    <div style={{ background: '#f4f7f9', minHeight: '100vh' }}>
      
      {/* Dynamic Glassy Hero */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, var(--navy) 0%, #0f172a 100%)', 
        padding: '100px 20px', 
        color: 'white', 
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
        />

        <div style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 30 }}>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/events/poster-presentation/register')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Register Now <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

        <motion.div relative zIndex={10} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '24px', color: '#34d399', textTransform: 'uppercase' }}>
            SAH 2026 Special Track
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Poster Presentation
          </h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.85, lineHeight: 1.6, fontWeight: 300 }}>
            The research-communication component of Smart Amrita Hackathon 2026. Present your own project, experimental or research outcome on a single A2 poster before an expert jury.
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
              {posterData.objectives.map((obj, idx) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {posterData.eligibility.map((item, idx) => (
                <motion.div 
                  whileHover={{ scale: 1.01 }} 
                  key={idx} 
                  className={item.span === 2 ? "md:col-span-2" : ""}
                  style={{ 
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
                  padding: '24px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--orange)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '12px' }}>
                    {item.label}
                  </div>
                  <div style={{ color: 'var(--navy)', fontWeight: 900, lineHeight: 1.5, fontSize: '1.1rem' }}>
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 3. Poster Scope */}
        <motion.section id="scope" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ background: 'var(--navy)', borderRadius: '32px', padding: '48px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px', position: 'relative', zIndex: 10 }}>Poster Scope</h2>
            
            <motion.div variants={childVariants} style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '20px 24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
              <ExternalLink color="#60A5FA" size={32} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#DBEAFE', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>Track Allotment:</strong> Every entry is placed in one of ten thematic tracks. Tracks are thematic, not departmental — a student of any programme may enter any track, and placement follows the subject of the work.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', position: 'relative', zIndex: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Qualifying Work</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {posterData.outputs.map((out, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 500 }}>
                      <CheckCircle2 size={14} color="#34d399" /> {out}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>10 Thematic Tracks</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {posterData.domains.map((domain, idx) => (
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
              The Poster Presentation will be held on <strong>Thursday, 10 September 2026</strong>. All deadlines close at 5.00 p.m. on the date indicated. No extensions will be granted.
            </p>
            
            <div style={{ position: 'relative', paddingLeft: '32px', maxWidth: '800px' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, var(--orange) 0%, #e2e8f0 100%)' }} />
              
              {posterData.keyDates.map((item, index) => {
                const isUpcoming = index === upcomingIndex;
                const isPast = index < upcomingIndex;
                
                return (
                  <motion.div key={index} variants={childVariants} style={{ position: 'relative', marginBottom: index === posterData.keyDates.length - 1 ? 0 : '32px' }}>
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
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Each poster is evaluated out of 50 marks during the display and technical interaction. (40 marks technical substance, 10 marks defense).</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {posterData.rubric.map((item, idx) => (
              <motion.div variants={childVariants} whileHover={{ y: -5 }} key={idx} style={{ background: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '24px', lineHeight: 1.4 }}>
                  {item.criterion}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Weightage</span>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.marks}</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: `${(item.marks / 10) * 100}%` }} 
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
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Awards and Recognition</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Thirteen awards are conferred — one Best Poster in each of the ten tracks, and three named cohort awards.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {posterData.awards.map((award, idx) => (
              <motion.div variants={childVariants} whileHover={{ scale: 1.03, rotate: 1 }} key={idx} style={{ 
                background: award.gradient, 
                padding: '2px',
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
            * A poster may receive one award only. Each award winner receives a medal and a Certificate of Merit.
          </p>
        </motion.section>

        {/* 7. General Information */}
        <motion.section id="requirements" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>General Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Poster Specification</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  A2 portrait (420 × 594 mm), two-column, only. Posters must be prepared on the official SAH 2026 A2 template. Mandatory sections: Problem Statement, Objectives, Methodology, Experimental Setup, Results & Discussion, Novelty & Own Contribution, Conclusion & Impact, References.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Presentation & Handouts</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  The author must be present at the poster throughout every scheduled jury round. Presentation may be in English or Tamil; the poster itself must be in English. Authors are advised to carry ten A4 reductions of their A2 poster for the jury and visitors.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#15803D', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Academic Integrity & Cross-Entry
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Posters must be original student work. A student may enter the same work in only one SAH 2026 category. Identical work submitted to both the Project Expo and the Poster Presentation will be withdrawn from one.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 8. Organizing Committee & Contact */}
        <motion.section id="contact" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>Organizing Committee</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Patron</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)' }}>Dr. V Jayakumar</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Principal, Amrita Chennai</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Poster Presentation – Campus SPoC</div>
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
                onClick={downloadPosterGuidelines}
                style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.2)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="var(--orange)" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Poster Guidelines</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>PDF Document (Available)</div>
                </div>
              </button>

              <button 
                onClick={downloadPosterTemplate}
                style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.2)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="var(--orange)" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Template A2 (Blank)</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>PPTX Document</div>
                </div>
              </button>

              <button 
                onClick={downloadPosterHardwareSample}
                style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.2)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                  <Cpu color="var(--orange)" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Hardware Sample</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>PDF Document</div>
                </div>
              </button>

              <button 
                onClick={downloadPosterSoftwareSample}
                style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.2)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                  <Cpu color="var(--orange)" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Software Sample</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>PDF Document</div>
                </div>
              </button>

            </div>
          </div>
        </motion.section>

        {/* Premium Floating CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          style={{ 
            position: 'relative', 
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
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.5rem', fontWeight: 800 }}>Ready to present your research?</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
              Secure your spot at the SAH 2026 Poster Presentation today.<br/>
              <strong style={{color: 'var(--orange)'}}>Note: Posters carry a single author. There are no teams in this category.</strong>
            </p>
          </div>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/events/poster-presentation/register')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', padding: '16px 40px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Register Now <ChevronRight size={20} strokeWidth={3} />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
