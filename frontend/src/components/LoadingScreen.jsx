import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 9 + 3, 100);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setExiting(true), 350);
          setTimeout(onDone, 1500);
        }
        return next;
      });
    }, 180);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] overflow-hidden bg-noir"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* deep red / gold ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(179,18,28,0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(212,175,55,0.12)_0%,_transparent_65%)]" />

        {/* birds */}
        <Birds />

        {/* water, now a dark reflective strip with gold ripples */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C1613" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <rect width="1200" height="200" fill="url(#water)" />
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d="M0,40 Q150,20 300,40 T600,40 T900,40 T1200,40"
                stroke="rgba(212,175,55,0.35)"
                strokeWidth="2"
                fill="none"
                initial={{ x: -40, y: i * 35 + 10 }}
                animate={{ x: [-40, 20, -40] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </div>

        {/* boat gliding across */}
        <motion.div
          className="absolute bottom-[18%] left-0"
          initial={{ x: "-20vw" }}
          animate={exiting ? { x: "120vw" } : { x: `${Math.max(progress - 8, 0)}vw` }}
          transition={{ duration: exiting ? 1.1 : 0.4, ease: "easeInOut" }}
        >
          <ChundanVallam />
        </motion.div>

        {/* percentage */}
        <div className="absolute bottom-10 left-1/2 w-full max-w-xs -translate-x-1/2 text-center">
          <p className="font-display text-2xl font-bold tracking-widest text-kasavu">
            {Math.floor(progress)}%
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-charcoal">
            <motion.div className="h-full bg-maroon" animate={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 font-display bold text-sm text-ivory/60">
            Every tradition has a story. <br/> Welcome to ours :)
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Birds() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <motion.svg
          key={i}
          width="28"
          height="14"
          viewBox="0 0 28 14"
          className="absolute"
          style={{ top: `${10 + i * 6}%` }}
          initial={{ x: "-10vw" }}
          animate={{ x: "110vw" }}
          transition={{ duration: 14 + i * 3, repeat: Infinity, ease: "linear", delay: i * 2 }}
        >
          <path d="M0 7 Q7 -3 14 7 Q21 -3 28 7" stroke="#D4AF37" strokeWidth="1.6" fill="none" opacity="0.5" />
        </motion.svg>
      ))}
    </>
  );
}

function ChundanVallam() {
  return (
    <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
      <path d="M10 60 Q30 85 110 85 Q190 85 210 60 Q170 70 110 70 Q50 70 10 60Z" fill="#1C1613" />
      <path d="M8 58 Q40 45 110 45 Q180 45 212 58" stroke="#B3121C" strokeWidth="4" fill="none" />
      <path d="M10 60 Q-6 40 6 15 Q16 30 24 55" fill="#1C1613" />
      <path d="M210 60 Q226 42 214 18 Q204 32 196 55" fill="#1C1613" />
      <rect x="26" y="52" width="164" height="4" fill="#D4AF37" opacity="0.9" />
      {[40, 70, 100, 130, 160].map((x, i) => (
        <circle key={i} cx={x} cy={44} r="5" fill="#D4AF37" opacity="0.65" />
      ))}
      <path d="M110 15 L110 3 L124 9 Z" fill="#B3121C" />
      <line x1="110" y1="15" x2="110" y2="45" stroke="#1C1613" strokeWidth="2" />
    </svg>
  );
}
