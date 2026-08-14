import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VARIANTS = [
  { text: "AARPO'26", lang: "English" },
  { text: "ആർപോ '26", lang: "Malayalam" },
  { text: "आर्पो '26", lang: "Hindi" },
  { text: "ஆர்போ '26", lang: "Tamil" },
  { text: "ఆర్పో '26", lang: "Telugu" },
  { text: "ಆರ್ಪೋ '26", lang: "Kannada" },
];

export default function LanguageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % VARIANTS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex min-h-[1.7em] w-full items-center justify-center overflow-hidden px-2 py-4 pt-6 sm:px-4 sm:py-5 sm:pt-8 md:px-6 md:py-6 md:pt-10 lg:px-8 lg:py-7 lg:pt-12 xl:px-10">
      <AnimatePresence mode="wait">
        <motion.h1
          key={VARIANTS[index].text}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full max-w-[min(96vw,56rem)] text-center font-display text-[clamp(2.6rem,6vw,5.25rem)] font-bold leading-[0.95] tracking-[0.02em] text-kasavu drop-shadow-[0_0_25px_rgba(212,175,55,0.35)]"
        >
          {VARIANTS[index].text}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
