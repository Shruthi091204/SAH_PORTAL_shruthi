import { cn } from "@/lib/utils";
import { useRef, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const defaultItems = [
  {
    num: "01",
    name: "Internal SIH",
    tag: "Smart Amrita Hackathon (SAH 2026)",
    desc: "Official campus qualifying hackathon for Smart India Hackathon (SIH 2026). Pitch solutions under the official 50-mark rubric.",
    buttonText: "LAUNCH SAH 2026 PORTAL 🚀",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    num: "02",
    name: "Project Expo",
    tag: "Annual Engineering Showcase",
    desc: "Exhibition of capstone engineering projects, hardware prototypes & live software modules judged by industry experts.",
    buttonText: "EXPLORE EXPO ARENA ⚡",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    num: "03",
    name: "Poster Presentation",
    tag: "Research & Innovation Track",
    desc: "Academic poster exhibition showcasing novel research methodologies, literature findings, and scientific discoveries.",
    buttonText: "ACCESS POSTER GALLERY ✦",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const ConnoisseurStackInteractor = ({
  items = defaultItems,
  className
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const mainGroupRef = useRef(null);
  const masterTl = useRef(null);

  const createLoop = (index) => {
    const item = items[index];
    const selector = `#${item.clipId} .path`;

    if (masterTl.current) masterTl.current.kill();

    if (imageRef.current) imageRef.current.setAttribute("href", item.image);
    if (mainGroupRef.current) mainGroupRef.current.setAttribute("clip-path", `url(#${item.clipId})`);

    gsap.set(selector, { scale: 0, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    // 1. IN (Expo Out)
    tl.to(selector, {
      scale: 1,
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    })
      // 2. IDLE (Sine Breath)
      .to(selector, {
        scale: 1.05,
        duration: 1.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        stagger: { amount: 0.2, from: "center" }
      })
      // 3. OUT (Expo In)
      .to(selector, {
        scale: 0,
        duration: 0.6,
        stagger: { amount: 0.3, from: "edges" },
        ease: "expo.in",
      });

    masterTl.current = tl;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createLoop(0);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleItemHover = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    createLoop(index);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col md:flex-row items-center justify-between min-h-screen w-full p-8 md:p-24 overflow-hidden transition-colors duration-500",
        "bg-white dark:bg-[#050505]",
        className
      )}
    >

      {/* LEFT SIDE: HIGH CONTRAST MENU & CRISP EXPLANATION */}
      <div className="z-20 w-full md:w-7/12">
        {/* Catchy Header for Our Events */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
            ✦ Flagship Arenas
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            CHRONICLES OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">INNOVATION</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Explore our premier campus hackathons, project showcases & research poster arenas.
          </p>
        </div>

        <nav>
          <ul className="flex flex-col gap-8 md:gap-10">
            {items.map((item, index) => (
              <li
                key={item.num}
                onMouseEnter={() => handleItemHover(index)}
                onClick={() => {
                  if (item.name === "Internal SIH") {
                    window.scrollTo(0, 0);
                    navigate('/sah');
                  } else if (item.name === "Project Expo") {
                    window.scrollTo(0, 0);
                    navigate('/events/project-expo');
                  } else if (item.name === "Poster Presentation") {
                    window.scrollTo(0, 0);
                    navigate('/events/poster-presentation');
                  } else {
                    alert(`The ${item.name} portal is coming soon.`);
                  }
                }}
                className="group cursor-pointer"
              >
                <div className="flex items-start gap-5">
                  {/* Numbers */}
                  <span className={cn(
                    "text-3xl md:text-4xl font-bold transition-all duration-500 mt-1",
                    activeIndex === index
                      ? "text-orange-500 scale-110"
                      : "text-zinc-400 dark:text-zinc-600"
                  )}>
                    {item.num}
                  </span>

                  {/* Title */}
                  <div className="flex flex-col justify-center flex-1">
                    <h2 className={cn(
                      "text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] transition-all duration-500",
                      activeIndex === index
                        ? "text-zinc-950 dark:text-white opacity-100 translate-x-4"
                        : "opacity-40 translate-x-0 " +
                        "text-zinc-500 dark:text-transparent " +
                        "dark:[text-stroke:1.5px_#52525b] dark:[-webkit-text-stroke:1.5px_#52525b]"
                    )}>
                      {item.name}
                    </h2>

                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* RIGHT SIDE: COMPACT ELEGANT PHOTO PREVIEW WITH EXPLANATION */}
      <div className="relative w-full md:w-5/12 flex flex-col justify-center items-center mt-12 md:mt-0">
        <div className="absolute w-[100%] h-[100%] bg-orange-500/10 dark:bg-orange-600/5 blur-[100px] rounded-full transition-opacity duration-1000" />

        <svg viewBox="0 0 500 500" className="w-[90%] max-w-[420px] h-auto z-10 drop-shadow-xl dark:drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 rounded-2xl p-2 bg-white/5 backdrop-blur-sm mb-8 transition-transform duration-500 hover:scale-105">
          <defs>
            <clipPath id="clip-pixels">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  className="path"
                  x={(i % 3) * 160 + 20}
                  y={Math.floor(i / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="6"
                />
              ))}
            </clipPath>
          </defs>

          <g ref={mainGroupRef} clipPath={`url(#${items[0].clipId})`}>
            <image
              ref={imageRef}
              href={items[0].image}
              width="500"
              height="500"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </svg>

        {/* Explanation on the Image Side */}
        <div key={activeIndex} className="z-20 w-[90%] max-w-[420px] text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          {items[activeIndex].tag && (
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              ✦ {items[activeIndex].tag}
            </div>
          )}
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium mb-8">
            {items[activeIndex].desc}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (items[activeIndex].name === "Internal SIH") {
                window.scrollTo(0, 0);
                navigate('/sah');
              } else if (items[activeIndex].name === "Project Expo") {
                window.scrollTo(0, 0);
                navigate('/events/project-expo');
              } else {
                alert(`The ${items[activeIndex].name} portal is coming soon.`);
              }
            }}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm md:text-base tracking-widest uppercase transition-all duration-300 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 flex items-center gap-2"
          >
            <span>{items[activeIndex].buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
