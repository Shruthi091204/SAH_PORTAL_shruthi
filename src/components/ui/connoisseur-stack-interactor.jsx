import { cn } from "@/lib/utils";
import { useRef, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const defaultItems = [
  {
    num: "01",
    name: "Project Expo",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    num: "02",
    name: "Internal Hackathon",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    num: "03",
    name: "Poster Presentation",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
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

      {/* LEFT SIDE: HIGH CONTRAST MENU */}
      <div className="z-20 w-full md:w-1/2">
        <nav>
          <ul className="flex flex-col gap-14">
            {items.map((item, index) => (
              <li
                key={item.num}
                onMouseEnter={() => handleItemHover(index)}
                className="group cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  {/* Numbers: Increased visibility for non-hover state */}
                  <span className={cn(
                    "text-3xl font-bold transition-all duration-500 mt-2",
                    activeIndex === index
                      ? "text-orange-500 scale-110"
                      : "text-zinc-400 dark:text-zinc-600"
                  )}>
                    {item.num}
                  </span>

                  {/* Main Text: Enhanced visibility logic */}
                  <div className="flex flex-col">
                    <h2 className={cn(
                      "text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] transition-all duration-700",
                      activeIndex === index
                        ? "text-zinc-950 dark:text-white opacity-100 translate-x-4"
                        // INACTIVE STATE: Increased from Zinc-200 to Zinc-400 for Light Mode
                        // Increased stroke visibility for Dark Mode (#52525b is Zinc-600)
                        : "opacity-40 translate-x-0 " +
                        "text-zinc-500 dark:text-transparent " +
                        "dark:[text-stroke:1.5px_#52525b] dark:[-webkit-text-stroke:1.5px_#52525b]"
                    )}>
                      {item.name.split(' ')[0]}<br />
                      {item.name.split(' ').slice(1).join(' ')}
                    </h2>

                    {activeIndex === index && (
                      <div className="mt-4 translate-x-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.name === "Internal Hackathon") {
                              window.scrollTo(0, 0);
                              navigate('/sah');
                            } else {
                              alert(`The ${item.name} portal is not yet available.`);
                            }
                          }}
                          className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors shadow-lg hover:shadow-orange-500/25 flex items-center gap-2"
                        >
                          Enter Website <span className="text-lg leading-none">→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* RIGHT SIDE: SQUARE GRID (Sharp Squares) */}
      <div className="relative w-full md:w-1/2 flex justify-center items-center mt-16 md:mt-0">
        <div className="absolute w-[120%] h-[120%] bg-orange-500/10 dark:bg-orange-600/5 blur-[120px] rounded-full transition-opacity duration-1000" />

        <svg viewBox="0 0 500 500" className="w-[100%] max-w-[500px] h-auto z-10 drop-shadow-xl dark:drop-shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <defs>
            <clipPath id="clip-original">
              <circle className="path" cx="250" cy="250" r="60" />
              <ellipse className="path" cx="250" cy="110" rx="30" ry="70" />
              <ellipse className="path" cx="250" cy="390" rx="30" ry="70" />
              <ellipse className="path" cx="110" cy="250" rx="70" ry="30" />
              <ellipse className="path" cx="390" cy="250" rx="70" ry="30" />
            </clipPath>

            <clipPath id="clip-hexagons">
              <rect className="path" x="20" y="20" width="200" height="280" rx="12" />
              <rect className="path" x="20" y="320" width="200" height="160" rx="12" />
              <rect className="path" x="240" y="20" width="240" height="140" rx="12" />
              <rect className="path" x="240" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="370" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="240" y="360" width="240" height="120" rx="12" />
            </clipPath>

            {/* Grid Squares with rx="4" as requested */}
            <clipPath id="clip-pixels">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  className="path"
                  x={(i % 3) * 160 + 20}
                  y={Math.floor(i / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="4"
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
      </div>
    </div>
  );
};
