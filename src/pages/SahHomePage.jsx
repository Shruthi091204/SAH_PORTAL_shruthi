import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  ChevronRight,
  Target,
  Zap,
  Users,
  Cpu,
  Trophy,
  ShieldCheck,
  CheckSquare,
  FileText,
  Mail
} from 'lucide-react';

import flowchart from '../assets/FLOWCHART.png';
import vJeyakumarImg from '../assets/V_jeyakumar.jpg';
import piyushImg from '../assets/piyush-pratap-singh-faculty-image.jpeg';
import simhadriImg from '../assets/simhadri_sir.jpeg';
import krishnakumarImg from '../assets/s-krishnakumar.png';
import nivethithaImg from '../assets/nivethitha.jpg';
import aravindImg from '../assets/Aravind.png';
import parthasarathyImg from '../assets/dr-parthasarathy.jpg';

export default function SahHomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [nearestDateIndex, setNearestDateIndex] = useState(-1);
  const today = new Date();

  const themes = [
    "Smart Automation", "Smart Education", "Smart Vehicles", "Robotics and Drones",
    "Agriculture/FoodTech & Rural Development", "MedTech/BioTech/HealthTech",
    "Clean & Green Technology", "Renewable/Sustainable Energy",
    "Transportation & Logistics", "Disaster Management", "Blockchain & Cybersecurity",
    "Space Technology", "Heritage & Culture", "Travel & Tourism",
    "Fitness & Sports", "Toys and Games", "Miscellaneous"
  ];

  const keyDates = [
    { title: "Registration Opens", dateStr: "2026-08-25T00:00:00", displayDate: "Tue, 25 Aug 2026", icon: <Users size={18} /> },
    { title: "Registration Closes", dateStr: "2026-08-31T17:00:00", displayDate: "Mon, 31 Aug 2026 (5:00 PM)", desc: "6-member team, PS ID, mentor endorsement, 6-slide Idea Presentation due", icon: <AlertTriangle size={18} /> },
    { title: "Pitch Deck Submission", dateStr: "2026-09-05T23:59:59", displayDate: "Sat, 5 Sep 2026", icon: <FileText size={18} /> },
    { title: "SAH 2026", dateStr: "2026-09-10T23:59:59", displayDate: "Thu, 10 Sep 2026", desc: "Live pitch + jury evaluation", icon: <Cpu size={18} /> },
    { title: "Announcement of Nominated Teams", dateStr: "2026-09-11T23:59:59", displayDate: "Fri, 11 Sep 2026", icon: <Trophy size={18} /> },
    { title: "Boot Camp for Nominated Teams", dateStr: "2026-09-15T00:00:00", displayDate: "Tue–Sat, 15–19 Sep 2026", icon: <Target size={18} /> },
    { title: "Idea Submission on SIH Portal", dateStr: "2026-09-20T23:59:59", displayDate: "Sun, 20 Sep 2026", desc: "By Campus SPOC", icon: <Zap size={18} /> }
  ];

  const rubric = [
    { criterion: "Novelty & Innovation", marks: 10, color: "#3B82F6" },
    { criterion: "Technical Approach & Complexity", marks: 10, color: "#8B5CF6" },
    { criterion: "Feasibility & Viability", marks: 10, color: "#F59E0B" },
    { criterion: "Impact, Scale & Sustainability", marks: 10, color: "#10B981" },
    { criterion: "Prototype & Demonstration Readiness", marks: 5, color: "#EC4899" },
    { criterion: "Presentation & Format Compliance", marks: 5, color: "#6366F1" }
  ];

  useEffect(() => {
    let nearestIdx = -1;
    let smallestDiff = Infinity;
    keyDates.forEach((item, index) => {
      const itemDate = new Date(item.dateStr);
      const diff = itemDate.getTime() - today.getTime();
      if (diff >= -86400000 && diff < smallestDiff) { // within last 24h or future
        smallestDiff = diff;
        nearestIdx = index;
      }
    });
    setNearestDateIndex(nearestIdx !== -1 ? nearestIdx : keyDates.length - 1);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
          style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
        />

        <motion.div relative="true" zIndex={10} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '24px', color: 'var(--orange)', textTransform: 'uppercase' }}>
            Amrita Vishwa Vidyapeetham, Chennai Campus
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Smart Amrita Hackathon 2026
          </h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.85, lineHeight: 1.6, fontWeight: 300, marginBottom: '40px' }}>
            Innovating India, Solving National Challenges. Join the official internal qualifying hackathon for Smart India Hackathon 2026.
          </p>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/register')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', padding: '16px 40px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Register Now <ChevronRight size={20} strokeWidth={3} />
          </button>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-60px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 }}>
        
        {/* Intro & Objectives */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          <motion.section id="objectives" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target color="var(--orange)" /> Objectives
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '24px' }}>
              SAH 2026 is an internal hackathon organized to prepare and shortlist the best student teams for SIH 2026. Students form teams of 6, choose themes from government ministries, and develop innovative solutions. The top 50 teams will be selected through rigorous Z-Score normalized judging.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                "Select the strongest teams for nomination to SIH 2026, strictly on merit",
                "Ensure every nominated idea is pre-screened against national parameters",
                "Encourage interdisciplinary teams across Software and Hardware editions",
                "Identify solutions with patenting, deployment, or startup incubation potential"
              ].map((obj, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--navy)', fontWeight: 500 }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--orange)', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} />
                  {obj}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Eligibility Bento Grid */}
          <motion.section id="eligibility" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 color="var(--orange)" /> Eligibility
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { label: "Who may apply", value: "B.Tech / M.Tech / PhD, any dept, Chennai Campus", span: 2 },
                { label: "Team size", value: "Exactly 6 students (inc. Team Leader)", span: 1 },
                { label: "Woman member", value: "Mandatory at least 1", span: 1 },
                { label: "Same institution", value: "All 6 from Amrita Chennai", span: 1 },
                { label: "Mentors", value: "Up to 2, mandatory endorsement", span: 1 },
                { label: "Entries per student", value: "One team only. Max 2 PS per team", span: 2 }
              ].map((item, idx) => (
                <motion.div whileHover={{ scale: 1.02 }} key={idx} style={{ 
                  gridColumn: `span ${item.span}`,
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '0.70rem', color: 'var(--orange)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {item.label}
                  </div>
                  <div style={{ color: 'var(--navy)', fontWeight: 600, lineHeight: 1.4, fontSize: '0.9rem' }}>
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div variants={childVariants} style={{ background: '#FEF2F2', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #EF4444', marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <AlertTriangle color="#DC2626" size={24} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#991B1B', fontSize: '0.85rem', fontWeight: 600 }}>
                A student registered in two teams causes BOTH teams to be disqualified.
              </p>
            </motion.div>
          </motion.section>
        </div>

        {/* Timeline & Themes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          <motion.section id="key-dates" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar color="var(--orange)" /> Key Dates
            </h2>
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, var(--orange) 0%, #e2e8f0 100%)' }} />
              
              {keyDates.map((item, index) => {
                const isUpcoming = index === nearestDateIndex;
                const isPast = index < nearestDateIndex;
                
                return (
                  <motion.div key={index} variants={childVariants} style={{ position: 'relative', marginBottom: index === keyDates.length - 1 ? 0 : '32px' }}>
                    <div style={{ 
                      position: 'absolute', left: '-32px', top: '2px', width: '24px', height: '24px', borderRadius: '50%', 
                      background: isUpcoming ? 'var(--orange)' : isPast ? '#94a3b8' : '#fff',
                      border: `3px solid ${isUpcoming ? '#fff' : isPast ? '#fff' : '#cbd5e1'}`,
                      boxShadow: isUpcoming ? '0 0 0 4px rgba(234,88,12,0.2)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                    }}>
                      {isUpcoming && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }} />}
                    </div>
                    
                    <div style={{ 
                      background: isUpcoming ? 'linear-gradient(to right, #fff7ed, #ffffff)' : 'transparent',
                      padding: '16px 20px', borderRadius: '12px',
                      border: isUpcoming ? '1px solid #fed7aa' : '1px solid transparent',
                      transform: isUpcoming ? 'translateX(10px)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isUpcoming ? 'var(--orange)' : 'var(--navy)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                        {item.icon} {item.title}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>{item.displayDate}</div>
                      {item.desc && <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>{item.desc}</div>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          <motion.section id="themes-categories" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px', scrollMarginTop: '100px', height: 'fit-content' }}>
            <div style={{ background: 'var(--navy)', borderRadius: '32px', padding: '40px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
              
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px', position: 'relative', zIndex: 10 }}>Themes & Categories</h2>
              
              <p style={{ marginBottom: '24px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, position: 'relative', zIndex: 10 }}>
                <strong>PS Category:</strong> Two editions — Software (programming-strong) and Hardware (multidisciplinary: mechanical, electronics, product design, programming).
              </p>

              <motion.div variants={childVariants} style={{ background: 'rgba(234, 88, 12, 0.1)', border: '1px solid rgba(234, 88, 12, 0.3)', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '32px', backdropFilter: 'blur(10px)' }}>
                <Zap color="#F97316" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, color: '#fed7aa', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>
                  <strong style={{ color: '#fff' }}>Essential condition:</strong> Concept notes, literature surveys, and video-only entries will NOT be evaluated. A working proof of concept is mandatory alongside the Idea Presentation.
                </p>
              </motion.div>

              <div style={{ position: 'relative', zIndex: 10 }}>
                <h3 style={{ fontSize: '1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>17 Official Themes</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {themes.map((theme, idx) => (
                    <span key={idx} onClick={() => navigate('/themes')} style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(234, 88, 12, 0.2)'} onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.2)'}>
                      {theme}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'nowrap', justifyContent: 'center' }}>
                  <button 
                    onClick={() => navigate('/themes')}
                    style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(234, 88, 12, 0.4)', whiteSpace: 'nowrap', flex: 1 }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Explore Themes <ChevronRight size={18} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={() => navigate('/problem-statements')}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', padding: '12px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.2)', whiteSpace: 'nowrap', flex: 1 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Problem Statements <ChevronRight size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Evaluation Rubric */}
        <motion.section id="evaluation-rubric" variants={containerVariants} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Evaluation Rubric</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Scoring criteria for live jury evaluation (Total: 50 Marks)</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {rubric.map((item, idx) => (
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

        {/* Awards */}
        <motion.section id="awards" variants={containerVariants} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Awards & Recognition</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Theme Winners and Special Accolades</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Theme Awards */}
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', textAlign: 'center' }}>Theme Awards (1–17)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {themes.map((theme, i) => (
                  <motion.div variants={childVariants} whileHover={{ scale: 1.02 }} key={i} style={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                    padding: '20px', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
                  }}>
                    <div style={{ padding: '4px 10px', background: '#f1f5f9', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderRadius: '12px', marginBottom: '12px' }}>
                      Award #{i+1}
                    </div>
                    <strong style={{ color: 'var(--navy)', fontSize: '1.1rem' }}>Best Team</strong>
                    <div style={{ color: 'var(--orange)', fontSize: '0.85rem', marginTop: '4px', fontWeight: '600' }}>{theme}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Special Awards */}
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', textAlign: 'center' }}>Special Awards (18–20)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {[
                  { name: "Best All-Women Team", desc: "Highest-scoring all-women team, across all themes/categories.", icon: <Users size={24} color="#C084FC" />, gradient: "linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)", border: "#E9D5FF" },
                  { name: "Young Innovator Award", desc: "Best team of first/second-years, judged on originality + build capability.", icon: <Zap size={24} color="#34D399" />, gradient: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)", border: "#A7F3D0" },
                  { name: "Home Ground Challenge", desc: "Best team solving a Chennai Campus-raised problem.", icon: <ShieldCheck size={24} color="#FB923C" />, gradient: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", border: "#FED7AA" }
                ].map((award, idx) => (
                  <motion.div variants={childVariants} whileHover={{ y: -5 }} key={idx} style={{ 
                    background: award.gradient, 
                    padding: '24px', 
                    borderRadius: '20px', 
                    border: `1px solid ${award.border}`,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        {award.icon}
                      </div>
                      <h4 style={{ margin: 0, color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 800 }}>{award.name}</h4>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{award.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem' }}>
              * No Winner/Runner-Up — each award has a single recipient team. One award per team. A theme needs 5+ registered teams to carry a Theme Award.
            </p>
          </div>
        </motion.section>

        {/* Requirements, Guidelines & Nomination */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          
          <motion.div id="submission-requirements" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px', height: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>Submission Requirements</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#3B82F6', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckSquare size={18} /> Idea Presentation</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  6 slides max: Title (PS ID, Title, Theme, Category, Team ID/Name, Idea Title), Proposed Solution, Technical Approach, Feasibility, Impact, Research.<br/>
                  <span style={{ color: 'var(--navy)', fontWeight: 600 }}>Use points, diagrams, infographics — not paragraphs.</span>
                </p>
              </div>
              <div>
                <h4 style={{ color: '#10B981', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckSquare size={18} /> Demonstration Checklist</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Team ID/Name, PS ID/Title, Theme, Category, 6 members, mentor, dept, working prototype, key innovation, results. Recommended: architecture, metrics, QR to video.
                </p>
              </div>
              <div style={{ background: '#FFF7ED', border: '1px dashed #F97316', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: '#9A3412' }}>
                <strong>Backup Plan:</strong> Video, screenshots, sample datasets, or recorded results — contingency only.
              </div>
            </div>
          </motion.div>

          <motion.div id="general-guidelines" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px', height: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px' }}>Guidelines & Integrity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#F0FDF4', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #22C55E' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18}/> Academic Integrity</h4>
                <p style={{ margin: 0, color: '#15803D', fontSize: '0.85rem', lineHeight: 1.5 }}>Cite all libraries, APIs, datasets, AI-assisted work. Misrepresentation = disqualification.</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#FEF2F2', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #EF4444' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#991B1B', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={18}/> Safety Declaration</h4>
                <p style={{ margin: 0, color: '#B91C1C', fontSize: '0.85rem', lineHeight: 1.5 }}>High voltage, chemicals, lasers, motors must be cleared by OC.</p>
              </motion.div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '8px' }}>• Team composition frozen at registration; no substitutions.<br/>• Reporting is compulsory to avoid forfeiture.</p>
            </div>
          </motion.div>

        </div>

        <motion.div id="nomination-support" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', scrollMarginTop: '100px', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px' }}>Nomination Support</h2>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', background: '#f8fafc', padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy)', borderBottom: '1px solid #e2e8f0' }}>
              <div>Recipient</div><div>Entitlement</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', padding: '12px 16px', fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600 }}>20 award-winning teams</div><div>Medal + Merit Cert + Nomination</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', padding: '12px 16px', fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600 }}>Next 30 teams</div><div>Nomination support only</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', padding: '12px 16px', fontSize: '0.85rem', background: '#FFF7ED', color: '#C2410C', fontWeight: 700 }}>
              <div>Total Pool</div><div>50 teams</div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>Selection ≠ upload. Final upload count set by SIH ceiling, via Campus SPOC only.</p>
        </motion.div>

        {/* Contact & OC */}
        <motion.section id="contact" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ background: '#fff', borderRadius: '32px', padding: '48px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', scrollMarginTop: '100px', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '40px', textAlign: 'center' }}>Contact & Organizing Committee</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '50%', color: 'var(--orange)' }}>
                <Mail size={32} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Official Contact</h4>
                <a href="mailto:sah@ch.amrita.edu" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', textDecoration: 'none' }}>sah@ch.amrita.edu</a>
              </div>
            </div>
          </div>

          <div className="oc-cards-row oc-cards-center" style={{ marginBottom: '40px' }}>
            <div className="oc-card oc-card-patron" style={{ border: 'none', background: 'linear-gradient(145deg, #ffffff, #f8fafc)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
              <div className="oc-avatar oc-avatar-lg"><img src={vJeyakumarImg} alt="Dr. V. Jeyakumar" /></div>
              <div className="oc-name">Dr. V. Jayakumar</div>
              <div className="oc-designation">Principal, Patron</div>
              <div className="oc-institution">Amrita Vishwa Vidyapeetham, Chennai Campus</div>
            </div>
            
            <div className="oc-card" style={{ border: 'none', background: 'linear-gradient(145deg, #ffffff, #f8fafc)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
              <div className="oc-avatar oc-avatar-md"><img src={piyushImg} alt="Dr. Piyush Pratap Singh" /></div>
              <div className="oc-name">Dr. Piyush Pratap Singh</div>
              <div className="oc-designation" style={{ color: 'var(--orange)', fontWeight: 700 }}>SPOC — SIH | Coordinator</div>
              <div className="oc-institution">Amrita Chennai Campus</div>
            </div>
          </div>

          <div className="oc-cards-row oc-cards-center">
            {[
              { img: simhadriImg, name: "Dr. Simhadri Ravishankar", role: "ECE & CCE Coordinator" },
              { img: nivethithaImg, name: "Mrs. V. Nivethitha", role: "CSE Coordinator", imgStyle: { objectPosition: 'center 15%' } },
              { img: krishnakumarImg, name: "Dr. S. Krishnakumar", role: "AI & AIE Coordinator" },
              { img: aravindImg, name: "Dr. Jinka Venkata Aravind", role: "CYS Coordinator" },
              { img: parthasarathyImg, name: "Dr. S. Parthasarathy", role: "Coordinator" }
            ].map((person, idx) => (
              <div key={idx} className="oc-card" style={{ border: 'none', background: '#f8fafc' }}>
                <div className="oc-avatar oc-avatar-md"><img src={person.img} alt={person.name} style={person.imgStyle || {}} /></div>
                <div className="oc-name">{person.name}</div>
                <div className="oc-designation">{person.role}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginTop: '60px', marginBottom: '32px', textAlign: 'center' }}>Student Core Team</h3>
          <div className="oc-cards-row oc-cards-center">
            {[
              { name: "Kutralingam A", contact: "To be shared shortly" },
              { name: "K L Vishnu Kamesh", contact: "To be shared shortly" },
              { name: "Shruthika Rajan", contact: "To be shared shortly" },
              { name: "Vishal P", contact: "To be shared shortly" }
            ].map((student, idx) => (
              <div key={idx} className="oc-card" style={{ border: 'none', background: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '24px' }}>
                <div className="oc-name" style={{ fontSize: '1.1rem' }}>{student.name}</div>
                <div className="oc-designation" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>Contact: {student.contact}</div>
              </div>
            ))}
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
            marginBottom: '40px',
            zIndex: 50
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.5rem', fontWeight: 800 }}>Ready to solve national challenges?</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Form your team and register for Smart Amrita Hackathon 2026.</p>
          </div>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/register')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', padding: '16px 40px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Register Now <ChevronRight size={20} strokeWidth={3} />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
