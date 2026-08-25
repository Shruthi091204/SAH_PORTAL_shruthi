import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Users, Zap, ShieldAlert, ShieldCheck, Mail, Calendar, ChevronRight, AlertTriangle, FileText, Award, Layers } from 'lucide-react';

const posterData = {
  objectives: [
    "Provide a platform for students and research scholars to present project, laboratory and research outcomes.",
    "Develop the ability to communicate technical work concisely and defend it before an expert panel.",
    "Recognise original student contribution, including work not suited to live demonstration.",
    "Identify work with potential for publication, patenting or further research support."
  ],
  eligibility: [
    { label: "Who may apply", value: "Students of any B.Tech, M.Tech or PhD programme, in any year of study.", span: 1 },
    { label: "Mode of entry", value: "Individual. Each poster carries a single author; there are no teams in this category.", span: 1 },
    { label: "Faculty mentor / guide", value: "Mandatory. A faculty mentor or research guide must endorse the entry, certifying authorship and originality.", span: 1 },
    { label: "Entries per student", value: "One poster per student.", span: 1 },
    { label: "Stage of work", value: "Completed, or sufficiently advanced to present a defensible result.", span: 1 },
    { label: "Registration", value: "Free. No registration fee is charged for any SAH 2026 category.", span: 1 }
  ],
  tracks: [
    { code: "T1", name: "Smart Manufacturing and Industry 5.0", scope: "Machining and process optimisation, additive manufacturing, metrology and inspection, digital twins, condition monitoring, materials characterisation, industrial IoT on the shop floor." },
    { code: "T2", name: "Robotics, Drones and Autonomous Systems", scope: "Manipulators, mobile robots, UAV design and control, SLAM and navigation, perception for autonomy, human–robot interaction, actuation and mechanism design." },
    { code: "T3", name: "Artificial Intelligence and Applied Machine Learning", scope: "Model architectures, computer vision, natural language processing, generative and foundation models, edge and efficient AI, explainability and responsible AI." },
    { code: "T4", name: "Data Science, Analytics and Decision Intelligence", scope: "Statistical modelling, forecasting, optimisation and operations research, data engineering, visual analytics, decision-support systems." },
    { code: "T5", name: "Cyber Security, Privacy and Trusted Computing", scope: "Threat detection, cryptography and applied security, secure software and hardware, digital forensics, privacy-preserving computation, blockchain and trust infrastructure." },
    { code: "T6", name: "Next-Generation Communication, IoT and Embedded Systems", scope: "5G/6G and wireless systems, antennas and RF, signal processing, VLSI and embedded design, sensor networks, edge computing infrastructure." },
    { code: "T7", name: "Energy, Sustainability and Climate Action", scope: "Renewable energy systems, energy storage and efficiency, thermal and fluid systems, emissions and waste, circular-economy engineering, environmental monitoring." },
    { code: "T8", name: "Healthcare, Biomedical and Assistive Technology", scope: "Medical devices and instrumentation, biosignal and medical image analysis, rehabilitation and assistive engineering, health informatics, biomechanics." },
    { code: "T9", name: "Smart Infrastructure, Mobility and Transportation", scope: "Intelligent transport systems, electric and connected vehicles, structural and infrastructure health, smart-city systems, logistics and supply chain." },
    { code: "T10", name: "Social Innovation, Inclusive and Educational Technology", scope: "Rural and community technology, accessibility, agri-tech, educational technology, low-cost engineering for underserved users, human-centred design." }
  ],
  keyDates: [
    { title: "Call for Posters & Registration Opens", dateStr: "2026-08-24T00:00:00", displayDate: "Mon, 24 Aug 2026", icon: <FileText size={20} /> },
    { title: "Registration Closes", dateStr: "2026-08-31T17:00:00", displayDate: "Mon, 31 Aug 2026", icon: <Target size={20} /> },
    { title: "Poster Submission", dateStr: "2026-09-05T17:00:00", displayDate: "Sat, 5 Sep 2026", icon: <Layers size={20} /> },
    { title: "Screening & Shortlisting", dateStr: "2026-09-07T17:00:00", displayDate: "Sun–Mon, 6–7 Sep 2026", icon: <CheckCircle2 size={20} /> },
    { title: "Announcement of Shortlist", dateStr: "2026-09-07T18:00:00", displayDate: "Mon, 7 Sep 2026", icon: <Zap size={20} /> },
    { title: "Poster Presentation & Jury Evaluation", dateStr: "2026-09-10T08:00:00", displayDate: "Thu, 10 Sep 2026", icon: <Users size={20} /> },
    { title: "Awards & Opportunity Mapping", dateStr: "2026-09-10T17:00:00", displayDate: "Thu, 10 Sep 2026", icon: <Award size={20} /> }
  ],
  specifications: [
    { label: "Fonts", value: "Cambria for headings, Calibri for body text. Both are used throughout the template. Do not substitute other fonts." },
    { label: "Type Scale", value: "Four sizes only. Title 36 pt Cambria bold · Section headings 24 pt Cambria bold · Author name, track badge 20 pt Calibri · All body text, bullets, captions, references and chart labels 16 pt Calibri." },
    { label: "Text and visuals", value: "Body text not exceeding 600 words in total across the whole poster. Figures, charts and diagrams to occupy at least half the sheet." },
    { label: "Originality of figures", value: "At least two figures must be authored by the student. Any figure reproduced from another source must be cited directly beneath it." },
    { label: "Images", value: "Minimum 300 dpi at printed size." },
    { label: "Printing", value: "A2 portrait on 170 gsm matte art paper. Lamination is discouraged as it causes glare. Authors arrange their own printing; clips are provided at the venue." },
    { label: "File naming", value: "SAH2026_POSTER_[TrackCode]_[PosterID]_[Surname].pdf — single flattened PDF, fonts embedded. The editable source file is to be retained and produced on request." }
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
    { name: "Best Poster — Smart Manufacturing and Industry 5.0", badge: "Track T1", gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)" },
    { name: "Best Poster — Robotics, Drones and Autonomous Systems", badge: "Track T2", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
    { name: "Best Poster — AI and Applied Machine Learning", badge: "Track T3", gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
    { name: "Best Poster — Data Science, Analytics and Decision Intelligence", badge: "Track T4", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
    { name: "Best Poster — Cyber Security, Privacy and Trusted Computing", badge: "Track T5", gradient: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)" },
    { name: "Best Poster — Next-Gen Communication, IoT and Embedded", badge: "Track T6", gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" },
    { name: "Best Poster — Energy, Sustainability and Climate Action", badge: "Track T7", gradient: "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)" },
    { name: "Best Poster — Healthcare, Biomedical and Assistive Tech", badge: "Track T8", gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" },
    { name: "Best Poster — Smart Infrastructure, Mobility and Transport", badge: "Track T9", gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" },
    { name: "Best Poster — Social Innovation, Inclusive and EdTech", badge: "Track T10", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
    { name: "Postgraduate Poster Research Excellence Award", badge: "M.Tech Cohort", gradient: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" },
    { name: "Doctoral Poster Research Excellence Award", badge: "PhD Cohort", gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
    { name: "Emerging Researcher Poster Award", badge: "1st Year B.Tech", gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" }
  ],
  oc: [
    { name: "Dr. S. Parthasarathy", role: "Poster Presentation — Campus SPoC" },
    { name: "Dr. Rishikumar", role: "MECH & RAI Programme Faculty Coordinator" },
    { name: "Dr. S. Veluchamy", role: "ECE & CCE Programme Faculty Coordinator" },
    { name: "Dr. K. Ashwini", role: "CSE Programme Faculty Coordinator" },
    { name: "Dr. IR Oviya", role: "AI & CYS Programme Faculty Coordinator" }
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
    <div style={{ background: '#f4f7f9', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Dynamic Glassy Hero */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, var(--navy) 0%, #0f172a 100%)', 
        padding: '140px 24px 100px', 
        textAlign: 'center',
        color: 'white',
        overflow: 'hidden'
      }}>
        {/* Abstract shapes */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
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
            Poster Presentation
          </h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.85, lineHeight: 1.6, fontWeight: 300 }}>
            The research-communication component of SAH 2026. Present your own project, experimental or research outcome on a single A2 poster before an expert jury.
          </p>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/events/poster-presentation/register')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', padding: '16px 40px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)', marginTop: '32px' }}
          >
            Register Now <ChevronRight size={20} strokeWidth={3} />
          </button>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-60px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          
          {/* Objectives (Left Column) */}
          <motion.section id="objectives" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', height: '100%', scrollMarginTop: '100px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target color="var(--orange)" /> Objectives
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {posterData.objectives.map((obj, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--navy)', fontWeight: 500, lineHeight: 1.6 }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--orange)', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} />
                  {obj}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Bento Grid Eligibility (Right Column) */}
          <motion.section id="eligibility" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px', scrollMarginTop: '100px' }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', height: '100%' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 color="var(--orange)" /> Eligibility Criteria
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {posterData.eligibility.map((item, idx) => (
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
                    <div style={{ color: 'var(--navy)', fontWeight: 600, lineHeight: 1.4, fontSize: '0.9rem' }}>
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

        </div>

        {/* Dynamic Poster Scope & Tracks */}
        <motion.section id="scope" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ background: 'var(--navy)', borderRadius: '32px', padding: '48px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', position: 'relative', zIndex: 10 }}>Poster Scope & Tracks</h2>
            
            <motion.div variants={childVariants} style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '24px', borderRadius: '16px', marginBottom: '40px', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 10 }}>
              <h3 style={{ fontSize: '1.2rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Qualifying Work</h3>
              <p style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 300 }}>
                An entry qualifies if it presents at least one of the following, authored by the student: a mini, capstone or design project; laboratory or experimental work extended beyond the prescribed exercise; work carried out under a funded or institutional research project; a research paper published, accepted or under review; an M.Tech or PhD research outcome; internship or industry project work with written permission from the host organisation; or an independent design, analysis or replication study with original results.
              </p>
            </motion.div>
            
            <motion.div variants={childVariants} style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', padding: '20px 24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
              <AlertTriangle color="#F87171" size={32} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#FECACA', fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>Essential Condition:</strong> The poster must carry a contribution that belongs to the author. Posters assembled from downloaded material, review-only or survey-only posters with no analysis, experiment, design or data of the author's own, product brochures, and work previously awarded at any Chennai Campus event will not be accepted.
              </p>
            </motion.div>

            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '24px', position: 'relative', zIndex: 10 }}>10 Thematic Tracks</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', position: 'relative', zIndex: 10 }}>
              {posterData.tracks.map((track, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px' }}>
                  <div style={{ display: 'inline-block', padding: '4px 10px', background: 'var(--orange)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
                    {track.code}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, margin: '0 0 12px 0', lineHeight: 1.3 }}>{track.name}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{track.scope}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Key Dates (Horizontal) */}
        <motion.section id="key-dates" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', marginBottom: '60px', width: '100%', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar color="var(--orange)" /> Key Dates
          </h2>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', paddingTop: '16px', overflowX: 'auto', paddingBottom: '24px', minWidth: 'min-content', gap: '16px' }}>
            {/* Horizontal Line */}
            <div style={{ position: 'absolute', top: '27px', left: '20px', right: '20px', height: '2px', background: 'linear-gradient(to right, var(--orange) 0%, #e2e8f0 100%)', zIndex: 1 }} />
            
            {posterData.keyDates.map((item, index) => {
              const isUpcoming = index === upcomingIndex;
              const isPast = index < upcomingIndex;
              
              return (
                <motion.div key={index} variants={childVariants} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '140px' }}>
                  {/* Timeline Dot */}
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    background: isUpcoming ? 'var(--orange)' : isPast ? '#94a3b8' : '#fff',
                    border: `3px solid ${isUpcoming ? '#fff' : isPast ? '#fff' : '#cbd5e1'}`,
                    boxShadow: isUpcoming ? '0 0 0 4px rgba(234,88,12,0.2)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
                    marginBottom: '20px'
                  }}>
                    {isUpcoming && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }} />}
                  </div>
                  
                  <div style={{ 
                    background: isUpcoming ? 'linear-gradient(to bottom, #fff7ed, #ffffff)' : 'transparent',
                    padding: '16px 12px', borderRadius: '12px',
                    border: isUpcoming ? '1px solid #fed7aa' : '1px solid transparent',
                    transform: isUpcoming ? 'translateY(-10px)' : 'none',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{ color: isUpcoming ? 'var(--orange)' : 'var(--navy)', marginBottom: '8px' }}>
                      {item.icon}
                    </div>
                    <div style={{ color: isUpcoming ? 'var(--orange)' : 'var(--navy)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', lineHeight: 1.3 }}>
                      {item.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {item.displayDate}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>
        
        {/* Poster Specifications */}
        <motion.section id="specifications" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px', scrollMarginTop: '100px', marginBottom: '60px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', height: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Layers color="var(--orange)" /> Poster Specifications
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: 1.6 }}>
              A2 portrait (420 × 594 mm), two-column, only. There is no alternative size or layout. Posters must be prepared on the official SAH 2026 A2 template issued with these guidelines. The template carries eight sections, all of which are mandatory: (1) Problem Statement · (2) Objectives · (3) Methodology · (4) Experimental Setup · (5) Results & Discussion · (6) Novelty & Own Contribution · (7) Conclusion & Impact · (8) References.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {posterData.specifications.map((item, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--orange)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {item.label}
                  </div>
                  <div style={{ color: 'var(--navy)', fontWeight: 500, lineHeight: 1.5, fontSize: '0.95rem' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Visual Evaluation Rubric */}
        <motion.section id="rubric" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginTop: '60px', marginBottom: '60px', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Evaluation Rubric</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>How your poster will be scored by the jury (Total: 50 Marks)</p>
          
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

        {/* Trophy Awards Grid */}
        <motion.section id="awards" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginTop: '60px', marginBottom: '80px', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Award Categories</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>13 Awards conferred across 10 tracks and 3 cohorts.</p>
          
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
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--navy)', fontWeight: 800, margin: 0, lineHeight: 1.4 }}>
                    {award.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', marginTop: '32px', fontSize: '0.95rem' }}>
            * A poster may receive one award only. If a poster tops both a track and a cohort, the cohort award passes to the next-ranked poster.
          </p>
        </motion.section>

        {/* General Info & Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '80px' }}>
          
          {/* General Information */}
          <motion.section id="general" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>General Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Display & Presentation</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                  Board numbers follow the Poster ID and are displayed at the venue from 08.00 hrs on the event day. The author must be present throughout every scheduled jury round. Presentation may be in English or Tamil; the poster itself must be in English.
                </p>
              </div>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Handouts</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                  Authors are advised to carry ten A4 reductions of their A2 poster for the jury and for visitors.
                </p>
              </div>
              <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #EF4444' }}>
                <h4 style={{ color: '#991B1B', fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>Academic Integrity</h4>
                <p style={{ color: '#B91C1C', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Posters must be original student work. Fabricated results, plagiarised content and undisclosed use of generative AI to produce results or the claimed contribution will lead to disqualification.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Contact & OC */}
          <motion.section id="contact" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>Contact & Organising Committee</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '50%', color: 'var(--orange)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <Mail size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Contact</h4>
                <a href="mailto:sah@ch.amrita.edu" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', textDecoration: 'none' }}>sah@ch.amrita.edu</a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {posterData.oc.map((person, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ fontSize: '1rem', color: 'var(--navy)', fontWeight: 700 }}>{person.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%' }}>{person.role}</div>
                </div>
              ))}
            </div>
          </motion.section>

        </div>

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
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.5rem', fontWeight: 800 }}>Ready to present your research?</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Secure your spot at the SAH 2026 Poster Presentation today.</p>
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
