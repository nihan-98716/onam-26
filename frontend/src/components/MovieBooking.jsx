import { motion } from "framer-motion";
import RippleButton from "./RippleButton.jsx";

export default function MovieBooking() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl border border-kasavu/30 bg-black/60 p-8 shadow-2xl shadow-kasavu/5 relative overflow-hidden group"
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-kasavu/10 blur-3xl transition-all duration-500 group-hover:bg-kasavu/20" />

        <h3 className="font-display text-2xl font-bold text-kasavu mb-4">
          Reserve Your Screen Space
        </h3>
        
        <p className="font-body text-sm leading-relaxed text-ivory/70 mb-8">
          The booking and seat selection for the Movie Night is now open on the official ticket gateway. Click below to choose your showtime, view the seat layout, and purchase tickets.
        </p>

        <div className="flex justify-center">
          <a
            href="https://theticket9.com/event/movie-night-4-dhurandhar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <RippleButton className="w-full px-8 py-3 text-sm font-bold uppercase tracking-wider text-noir bg-gradient-to-r from-kasavu via-yellow-500 to-kasavu hover:shadow-lg hover:shadow-kasavu/20 transition-all active:scale-95 duration-300">
              🎟️ Book Seats
            </RippleButton>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
