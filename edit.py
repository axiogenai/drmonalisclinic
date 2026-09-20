import re

with open('src/components/ServicesSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add framer-motion imports
content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';")
content = content.replace("import React, { useState } from 'react';", "import React, { useRef, useState, useEffect, useMemo } from 'react';")

# Add math logic
math_logic = """
const clampVal = (t: number, n: number, s: number) => Math.min(Math.max(t, n), s);
const stepF = 0.5;

const desktopConfig = {
  peek: 0.05,
  scaleStep: 0.028,
  exitShrink: 0.05,
  maxDepth: 2,
};

const mobileConfig = {
  peek: 0.038,
  scaleStep: 0,
  exitShrink: 0,
  maxDepth: 1,
};

const exitDistanceH = 1.45; 

const calcShiftS = (t: number, n: number) => clampVal((t - n) / stepF, 0, 1);

const calcElevationE = (t: number, n: number, s: number) => {
  const r = n - Math.max(t, 0);
  if (r <= 0) return 0;
  const i = Math.floor(r);
  const m = r - i;
  return Math.min(i + clampVal((m - (1 - stepF)) / stepF, 0, 1), s);
};

const calcOpacityU = (t: number, n: number, s: number) => clampVal(s + 1 - (n - Math.max(t, 0)), 0, 1);

const generateSafeKeyframes = (
  t: number,
  n: number,
  cfg: typeof desktopConfig
) => {
  const { peek: r, scaleStep: i, exitShrink: m, maxDepth: l } = cfg;
  
  const points: { p: number; y: string; scale: number; opacity: number }[] = [];
  const count = 100;
  for (let step = 0; step <= count; step++) {
    const p = step / count;
    const a = p * n - 1;
    const yVal = `${((calcElevationE(a, t, l) * r - calcShiftS(a, t) * exitDistanceH) * 100).toFixed(3)}%`;
    const scaleVal = Number((1 - calcElevationE(a, t, l) * i - calcShiftS(a, t) * m).toFixed(4));
    const opacityVal = Number(calcOpacityU(a, t, l).toFixed(4));
    points.push({ p, y: yVal, scale: scaleVal, opacity: opacityVal });
  }

  const filtered = [points[0]];
  for (let idx = 1; idx < points.length - 1; idx++) {
    const prev = filtered[filtered.length - 1];
    const curr = points[idx];
    const next = points[idx + 1];
    if (
      curr.y !== prev.y || curr.scale !== prev.scale || curr.opacity !== prev.opacity ||
      curr.y !== next.y || curr.scale !== next.scale || curr.opacity !== next.opacity
    ) {
      filtered.push(curr);
    }
  }
  filtered.push(points[points.length - 1]);

  return {
    progress: filtered.map((pt) => pt.p),
    y: filtered.map((pt) => pt.y),
    scale: filtered.map((pt) => pt.scale),
    opacity: filtered.map((pt) => pt.opacity),
  };
};

function DeckCardItem({
  service,
  index,
  total,
  progress,
  keyframes,
  active,
  onClick,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  keyframes: ReturnType<typeof generateSafeKeyframes>;
  active: boolean;
  onClick: () => void;
}) {
  const y = useTransform(progress, keyframes.progress, keyframes.y);
  const scale = useTransform(progress, keyframes.progress, keyframes.scale);
  const opacity = useTransform(progress, keyframes.progress, keyframes.opacity);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-4"
      style={{ zIndex: total - index }}
    >
      <motion.div
        onClick={onClick}
        className="group relative w-full max-w-[420px] rounded-[28px] overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.06)] bg-black"
        style={{ 
          minHeight: '440px',
          y, 
          scale, 
          opacity, 
          pointerEvents: active ? 'auto' : 'none' 
        }}
      >
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${service.accent}`} />

        {service.badge && (
          <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm text-[10px] font-['Source_Sans_3'] font-bold text-gray-800 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {service.badge}
          </div>
        )}

        <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: service.iconColor }}>
          <CategoryIcon cat={service.category} />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-7">
          <p className="text-white/70 text-[11px] font-['Source_Sans_3'] font-semibold uppercase tracking-[0.15em] mb-1">
            {service.tagline}
          </p>
          <h3 className="font-['Playfair_Display'] text-2xl md:text-[28px] font-normal text-white mb-2 leading-tight">
            {service.title}
          </h3>
          <p className="font-['Source_Sans_3'] text-white/85 text-sm leading-relaxed mb-4 line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-['Source_Sans_3'] px-2.5 py-1 rounded-full border border-white/20">
              <Clock className="w-3 h-3" /> {service.downtime}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-['Source_Sans_3'] px-2.5 py-1 rounded-full border border-white/20">
              <Calendar className="w-3 h-3" /> {service.sessions}
            </span>
          </div>
          <button className="self-start flex items-center gap-2 bg-white text-gray-900 text-xs font-['Source_Sans_3'] font-semibold px-4 py-2 rounded-full hover:bg-[#FAF0DD] transition-colors shadow-sm">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ServicesSection() {
"""
content = re.sub(r'export default function ServicesSection\(\) \{', math_logic, content)

hooks = """
  const containerRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const config = isDesktop ? desktopConfig : mobileConfig;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const total = visible.length;
  const keyframes = useMemo(
    () => visible.map((_, idx) => generateSafeKeyframes(idx, total, config)),
    [visible, total, config]
  );

  const [activeCard, setActiveCard] = useState(0);
  const activeRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (val) => {
    const next = clampVal(Math.round(val * total - 1), 0, total - 1);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActiveCard(next);
    }
  });
"""

content = content.replace("    : SERVICES.filter(s => s.category === cat || (cat === 'body' && s.category === 'surgery'));", "    : SERVICES.filter(s => s.category === cat || (cat === 'body' && s.category === 'surgery'));\n" + hooks)

bento_grid_re = re.compile(r'\{\/\* Bento Grid \*\/\}.*?(?=\{\/\* Bottom CTA bar \*\/\})', re.DOTALL)

deck_replacement = """{/* Deck Stack */}
        <article ref={containerRef} className="relative w-full" style={{ height: `${total * 85}svh` }}>
          <div className="sticky top-20 md:top-24 h-[75svh] md:h-[80svh] flex items-center justify-center overflow-hidden">
            {visible.map((s, index) => (
              <DeckCardItem
                key={s.title}
                service={s}
                index={index}
                total={total}
                progress={scrollYProgress}
                keyframes={keyframes[index]}
                active={activeCard === index}
                onClick={() => setModal(s)}
              />
            ))}
          </div>
        </article>

        """
content = bento_grid_re.sub(deck_replacement, content)

with open('src/components/ServicesSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
