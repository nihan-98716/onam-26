import { motion } from "framer-motion";
import FloatingPetals from "./FloatingPetals.jsx";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-noir bg-cover bg-bottom bg-no-repeat bg-[url('/images/hero_mob.webp')] md:bg-[url('/images/hero.webp')]"
    >
      {/* Top Vignette Gradient Overlay (Fades top to black under transparent navbar) */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-noir via-noir/70 to-transparent pointer-events-none z-10" />

      {/* Floating petals overlay to keep the visual dynamic animation */}
      <FloatingPetals count={15} />
    </section>
  );
}
