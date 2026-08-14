import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../hooks/useApi.js";

const TONE_BG = {
  gold: "from-kasavu/70 to-kasavu/20",
  maroon: "from-maroon/80 to-maroon/25",
  green: "from-[#3a2f14] to-[#1c1613]",
  ivory: "from-[#3a2f1c] to-charcoal",
};

export default function Gallery() {
  const { data: photos } = useApi("/gallery", []);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const paused = useRef(false);

  useEffect(() => {
    if (!photos.length) return;
    const id = setInterval(() => {
      if (paused.current) return;
      setActive((a) => (a + 1) % photos.length);
    }, 3200);
    return () => clearInterval(id);
  }, [photos.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const card = el.children[active];
    if (!card) return;

    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const containerWidth = el.clientWidth;
    const targetLeft = cardLeft - containerWidth / 2 + cardWidth / 2;

    el.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [active]);

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-16 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-kasavu/70">Moments</p>
        <h2 className="font-display text-4xl font-bold text-kasavu sm:text-5xl">Gallery</h2>
      </div>

      <div
        className="relative"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <div
          ref={trackRef}
          className="snap-row flex gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((p, i) => (
            <motion.div
              key={p.id}
              className={`snap-item group relative h-72 w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br sm:h-80 sm:w-72 ${TONE_BG[p.tone]}`}
              animate={{ scale: i === active ? 1 : 0.92, opacity: i === active ? 1 : 0.55 }}
              transition={{ duration: 0.5 }}
              onClick={() => setSelected(p)}
            >
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="font-display text-sm font-semibold text-ivory">{p.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* prev / next controls */}
        <button
          aria-label="Previous"
          onClick={() => setActive((a) => (a - 1 + photos.length) % photos.length)}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-kasavu/40 bg-noir/70 p-2 text-kasavu backdrop-blur hover:bg-kasavu/10"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={() => setActive((a) => (a + 1) % photos.length)}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-kasavu/40 bg-noir/70 p-2 text-kasavu backdrop-blur hover:bg-kasavu/10"
        >
          ›
        </button>

        {/* dots */}
        <div className="mt-6 flex justify-center gap-2">
          {photos.map((p, i) => (
            <button
              key={p.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-kasavu" : "w-2 bg-kasavu/30"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`flex h-[70vh] w-full max-w-2xl items-end rounded-3xl border border-kasavu/30 bg-gradient-to-br p-8 ${TONE_BG[selected.tone]}`}
            >
              <p className="font-display text-2xl font-bold text-ivory">{selected.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
