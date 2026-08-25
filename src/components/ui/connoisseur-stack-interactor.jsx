import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const defaultItems = [
  {
    num: "01",
    name: "Project Expo",
    tag: "Annual Engineering Showcase",
    desc: "Exhibition of capstone engineering projects, hardware prototypes & live software modules judged by industry experts.",
    buttonText: "EXPLORE EXPO ARENA ⚡"
  },
  {
    num: "02",
    name: "Internal Hackathon",
    tag: "Smart Amrita Hackathon (SAH 2026)",
    desc: "Official campus qualifying hackathon for Smart India Hackathon (SIH 2026). Pitch solutions under the official 50-mark rubric.",
    buttonText: "LAUNCH SAH 2026 PORTAL 🚀"
  },
  {
    num: "03",
    name: "Poster Presentation",
    tag: "Research & Innovation Track",
    desc: "Academic poster exhibition showcasing novel research methodologies, literature findings, and scientific discoveries.",
    buttonText: "ACCESS POSTER GALLERY ✦"
  }
];

export const ConnoisseurStackInteractor = ({
  items = defaultItems,
  className
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className={cn(
        "flex flex-col justify-center min-h-screen w-full p-6 md:p-12 lg:p-24 relative overflow-hidden",
        className
      )}
      style={{
        background: "transparent",
        color: "#ffffff"
      }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "linear-gradient(to bottom, black, transparent 80%)"
      }} />

      <div className="z-20 w-full max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#ff8c1a] text-xs font-bold uppercase tracking-[0.2em] mb-6">
            ✦ Flagship Arenas
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase" style={{ color: '#ffffff' }}>
            CHRONICLES OF <span style={{ color: '#ff8c1a' }}>INNOVATION</span>
          </h1>
          <p className="text-sm md:text-base mt-6 font-medium mx-auto max-w-2xl" style={{ color: '#999999' }}>
            Explore our premier campus hackathons, project showcases & research poster arenas.
          </p>
        </div>

        <nav>
          <ul className="flex flex-col gap-4">
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <li
                  key={item.num}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="group cursor-pointer relative"
                >
                  <div className={cn(
                    "flex flex-col p-6 md:p-8 rounded-2xl transition-all duration-500 border",
                    isActive 
                      ? "bg-[#111111] border-[#333333] shadow-2xl backdrop-blur-md" 
                      : "bg-transparent border-transparent hover:bg-white/5"
                  )}>
                    <div className="flex items-center gap-6">
                      <span className={cn(
                        "text-3xl md:text-5xl font-light transition-colors duration-500",
                        isActive ? "text-[#ff8c1a]" : "text-white/30"
                      )}>
                        {item.num}
                      </span>
                      <h2 className={cn(
                        "text-2xl md:text-5xl font-bold uppercase tracking-tight transition-colors duration-500",
                        isActive ? "text-white" : "text-white/40 group-hover:text-white/60"
                      )}>
                        {item.name}
                      </h2>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ml-0 md:ml-16 lg:ml-20"
                        >
                          <div className="flex-1 max-w-2xl">
                            {item.tag && (
                              <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider text-[#ff8c1a] bg-[#ff8c1a]/10 border border-[#ff8c1a]/20">
                                {item.tag}
                              </div>
                            )}
                            <p className="text-base text-[#999999] leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.name === "Internal Hackathon") {
                                window.scrollTo(0, 0);
                                navigate('/sah');
                              } else if (item.name === "Project Expo") {
                                window.scrollTo(0, 0);
                                navigate('/events/project-expo');
                              } else {
                                alert(`The ${item.name} portal is coming soon.`);
                              }
                            }}
                            className="shrink-0 px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 bg-[#ff8c1a] text-white shadow-[0_10px_25px_-5px_rgba(255,140,26,0.3)] hover:shadow-[0_15px_35px_-5px_rgba(255,140,26,0.4)] hover:bg-[#ff9c3a]"
                          >
                            {item.buttonText}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

