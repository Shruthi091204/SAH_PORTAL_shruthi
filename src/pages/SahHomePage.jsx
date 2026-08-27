import React, { useMemo, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { downloadGuidelines, downloadPPTTemplate } from '../utils/downloadResources';
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
  FileText,
  Mail
} from 'lucide-react';

const hackathonData = {
  objectives: [
    "Select, strictly on merit, the strongest teams for nomination to the SIH 2026 portal.",
    "Ensure every nominated idea is already prepared against the national screening parameters before it leaves the campus.",
    "Encourage interdisciplinary teams across departments, in both the Software and the Hardware editions.",
    "Identify solutions with potential for patenting, deployment with the sponsoring organisation, or startup incubation."
  ],
  eligibility: [
    { label: "Who may apply", value: <>Students of any B.Tech, M.Tech or PhD programme, in any year of study, from any department of the Chennai Campus.</>, span: 2 },
    { label: "Team size", value: <>Exactly <strong>6 students</strong>, including a designated Team Leader. Teams of any other size cannot be nominated to the SIH portal.</>, span: 1 },
    { label: "Woman member", value: <>Mandatory. Every team must include at least <strong>one woman member</strong>. All-women teams are welcome.</>, span: 1 },
    { label: "Same institution", value: <><strong>All six members</strong> must be from Amrita Chennai Campus. Inter-institution teams are not permitted. Members from different departments are strongly encouraged.</>, span: 1 },
    { label: "Mentors", value: <>Up to two mentors — senior faculty or domain experts from any department. Mentor endorsement at registration is mandatory.</>, span: 1 },
    { label: "Entries per student", value: <><strong>One team only</strong>. A student registered in two teams will cause both teams to be disqualified. A team may address up to two problem statements.</>, span: 2 },
    { label: "Problem mapping", value: <>Each team must register against one SIH 2026 Problem Statement (with its PS ID) or one Student Innovation idea mapped to a notified SIH theme.</>, span: 2 }
  ],
  themes: [
    "Smart Automation", "Smart Education", "Smart Vehicles", "Robotics and Drones",
    "Agriculture, FoodTech & Rural Development", "MedTech / BioTech / HealthTech",
    "Clean & Green Technology", "Renewable / Sustainable Energy",
    "Transportation & Logistics", "Disaster Management", "Blockchain & Cybersecurity",
    "Space Technology", "Heritage & Culture", "Travel & Tourism",
    "Fitness & Sports", "Toys and Games", "Miscellaneous"
  ],
  keyDates: [
    { title: "Registration Opens", dateStr: "2026-08-25", displayDate: "Tue, 25 Aug 2026", icon: <Users size={18} /> },
    { title: "Registration Closes", dateStr: "2026-08-31", displayDate: "Mon, 31 Aug 2026", icon: <AlertTriangle size={18} /> },
    { title: "Pitch Deck Submission", dateStr: "2026-09-05", displayDate: "Sat, 5 Sep 2026", icon: <CheckSquare size={18} /> },
    { title: "Smart Amrita Hackathon (SAH) 2026", dateStr: "2026-09-10", displayDate: "Thu, 10 Sep 2026", icon: <Cpu size={18} /> },
    { title: "Announcement of Nominated Teams", dateStr: "2026-09-11", displayDate: "Fri, 11 Sep 2026", icon: <Trophy size={18} /> },
    { title: "Boot Camp for Nominated Teams", dateStr: "2026-09-15", displayDate: "Tue–Sat, 15–19 Sep 2026", icon: <Target size={18} /> },
    { title: "Idea Submission on the SIH Portal", dateStr: "2026-09-20", displayDate: "Sun, 20 Sep 2026", icon: <Zap size={18} /> }
  ],
  rubric: [
    { criterion: "Novelty & Innovation", marks: 10, color: "#3B82F6" },
    { criterion: "Technical Approach & Complexity", marks: 5, color: "#8B5CF6" },
    { criterion: "Feasibility & Viability", marks: 10, color: "#F59E0B" },
    { criterion: "Impact, Scale & Sustainability", marks: 10, color: "#10B981" },
    { criterion: "Prototype & Demonstration Readiness", marks: 10, color: "#EC4899" },
    { criterion: "Presentation & Format Compliance", marks: 5, color: "#6366F1" }
  ],
  awards: [
    { name: "Theme Awards (1-17)", badge: "Highest score in each theme", gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" },
    { name: "Best All-Women Team Award", badge: "Special Award", gradient: "linear-gradient(135deg, #C084FC 0%, #A855F7 100%)" },
    { name: "Young Innovator Award", badge: "Special Award", gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)" },
    { name: "Home Ground Challenge Winner", badge: "Special Award", gradient: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)" }
  ]
};

export default function SahHomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  
  const upcomingIndex = useMemo(() => {
    let nearestIdx = -1;
    let smallestDiff = Infinity;
    hackathonData.keyDates.forEach((item, index) => {
      const itemDate = new Date(item.dateStr);
      const diff = itemDate.getTime() - today.getTime();
      if (diff >= -86400000 && diff < smallestDiff) {
        smallestDiff = diff;
        nearestIdx = index;
      }
    });
    return nearestIdx !== -1 ? nearestIdx : hackathonData.keyDates.length - 1;
  }, [today]);

  useEffect(() => {
    // Scroll to hash on load if present
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Wait for framer motion and layout to settle
    }
  }, []);



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

        <div style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 30 }}>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Login to Portal <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

        <motion.div relative="true" zIndex={10} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '24px', color: 'var(--orange)', textTransform: 'uppercase' }}>
            Amrita Vishwa Vidyapeetham, Chennai Campus
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Smart Amrita Hackathon 2026
          </h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.85, lineHeight: 1.6, fontWeight: 300 }}>
            Amrita Hackathon(Internal SIH) for Smart India Hackathon (SIH) 2026. Innovating India, Solving National Challenges.
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
              {hackathonData.objectives.map((obj, idx) => (
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
              {hackathonData.eligibility.map((item, idx) => (
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
                  <div style={{ color: 'var(--navy)', fontWeight: 700, lineHeight: 1.5, fontSize: '1.1rem' }}>
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 3. Themes & Categories */}
        <motion.section id="themes" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ background: 'var(--navy)', borderRadius: '32px', padding: '48px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px', position: 'relative', zIndex: 10 }}>Themes & Categories</h2>
            
            <motion.div variants={childVariants} style={{ background: 'rgba(234, 88, 12, 0.1)', border: '1px solid rgba(234, 88, 12, 0.3)', padding: '20px 24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
              <AlertTriangle color="#F97316" size={32} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#fed7aa', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>Essential condition:</strong> Concept notes, literature surveys, and video-only entries will NOT be evaluated. A working proof of concept is mandatory alongside the Idea Presentation.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', position: 'relative', zIndex: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>PS Categories</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 500 }}>
                    <Zap size={14} color="var(--orange)" /> Software Edition
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 500 }}>
                    <Zap size={14} color="var(--orange)" /> Hardware Edition
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>17 Official Themes</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {hackathonData.themes.map((theme, idx) => (
                    <span key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
              <button 
                onClick={() => navigate('/themes')}
                style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', border: 'none', color: '#fff', padding: '14px 28px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(234, 88, 12, 0.4)' }}
              >
                Explore Themes <ChevronRight size={18} strokeWidth={3} />
              </button>
              <button 
                onClick={() => navigate('/problem-statements')}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '14px 28px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                Problem Statements <ChevronRight size={18} strokeWidth={3} />
              </button>
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
              All deadlines close strictly at 5.00 p.m. on the date indicated. No extensions will be granted.
            </p>
            
            <div style={{ position: 'relative', paddingLeft: '32px', maxWidth: '800px' }}>
              {/* Vertical Line */}
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, var(--orange) 0%, #e2e8f0 100%)' }} />
              
              {hackathonData.keyDates.map((item, index) => {
                const isUpcoming = index === upcomingIndex;
                const isPast = index < upcomingIndex;
                
                return (
                  <motion.div key={index} variants={childVariants} style={{ position: 'relative', marginBottom: index === hackathonData.keyDates.length - 1 ? 0 : '32px' }}>
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
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Each team is evaluated out of 50 marks during the live pitch and technical interaction.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {hackathonData.rubric.map((item, idx) => (
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
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px', textAlign: 'center' }}>Recognition and Awards</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Nomination support for SIH 2026 is the principal outcome of SAH 2026.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {hackathonData.awards.map((award, idx) => (
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
          
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', marginTop: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px' }}>Nomination Support</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 700, color: 'var(--navy)' }}>The 20 award-winning teams</span>
                <span style={{ color: 'var(--text-secondary)' }}>Medal, Certificate, Nomination support</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 700, color: 'var(--navy)' }}>The next 30 teams in rank order</span>
                <span style={{ color: 'var(--text-secondary)' }}>Nomination support</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                <span style={{ fontWeight: 800, color: 'var(--orange)' }}>Total selected</span>
                <span style={{ fontWeight: 800, color: 'var(--orange)' }}>50 teams</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 7. General Information */}
        <motion.section id="requirements" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>General Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Idea Presentation</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Six slides maximum, in the SIH Idea Submission format: (i) Title, (ii) Proposed Solution, (iii) Technical Approach, (iv) Feasibility and Viability, (v) Impact and Benefits, (vi) Research and References. Use points, diagrams and infographics — not paragraphs.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Demonstration display</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Mandatory at the table: Team ID and Team Name, PS ID and PS Title, Theme and PS Category, all six members, mentor(s), department, the working prototype or software system, the key innovation and major results.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#B91C1C', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} /> Safety
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Projects involving high voltage, batteries, lasers, chemicals or biological materials must be declared at registration and cleared by the Organising Committee, which may prohibit any demonstration considered unsafe.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#15803D', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Academic integrity
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                  Work must be original. All libraries, datasets, APIs, and AI-assisted development must be declared and cited. Misrepresentation of third-party work as student-developed will lead to disqualification.
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
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Campus SIH 2026 SPoC & MECH RAI Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. Piyush Pratap Singh</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>ECE & CCE Programme Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. Simhadri Ravishankar</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>CSE Programme Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Mrs. V. Nivethitha</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>AI & AIE Programme Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. S. Krishnakumar</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>CYS Programme Faculty Coordinator</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Dr. Jinka Venkata Aravind</div>
                </div>
              </div>
            </div>

            {/* Student Core Team */}
            <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', color: 'white', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '32px' }}>Student Core Team</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { name: 'Kutralingam A', email: '27.kutralingam.xi.b@gmail.com', phone: '6382725104' },
                  { name: 'K L Vishnu Kamesh', email: 'kothapallilalithavishnukamesh@gmail.com', phone: '736250061' },
                  { name: 'Shruthika Rajan', email: 'shruthika.rajan@gmail.com', phone: '9074383050' },
                  { name: 'Vishal P', email: 'vishal.pr2004@gmail.com', phone: '8951313335' }
                ].map((contact, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{contact.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Email ID: <a href={`mailto:${contact.email}`} style={{ color: 'var(--orange)', textDecoration: 'none' }}>{contact.email}</a>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Phone: <a href={`tel:${contact.phone}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{contact.phone}</a>
                    </div>
                  </div>
                ))}
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
                onClick={downloadGuidelines}
                style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.2)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="var(--orange)" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>SAH Guidelines</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>PDF Document (Available)</div>
                </div>
              </button>

              <button 
                onClick={downloadPPTTemplate}
                style={{ background: 'var(--orange)', color: 'white', border: 'none', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.2)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
                  <FileText color="#fff" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Official PPT Template</div>
                  <div style={{ fontSize: '0.9rem', color: '#fed7aa' }}>.pptx File (Available)</div>
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
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.5rem', fontWeight: 800 }}>Ready to solve national challenges?</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
              Form your team and register for Smart Amrita Hackathon 2026 inside the portal.<br/>
              <strong style={{color: 'var(--orange)'}}>Note: Registration occurs strictly inside the Dashboard once you log in.</strong>
            </p>
          </div>
          <button 
            className="btn btn-orange btn-lg" 
            onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', padding: '16px 40px', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.4)' }}
          >
            Login to Portal <ChevronRight size={20} strokeWidth={3} />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
