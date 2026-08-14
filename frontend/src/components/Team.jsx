import { motion } from "framer-motion";
import { useApi } from "../hooks/useApi.js";

export default function Team() {
  const { data: people } = useApi("/team", []);
  const groups = [...new Set(people.map((p) => p.group))];

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-16 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-kasavu/70">Behind Aarpo</p>
        <h2 className="font-display text-4xl font-bold text-kasavu sm:text-5xl">Core Committee</h2>
      </div>

      {groups.map((group) => (
        <div key={group} className="mb-14">
          <h3 className="mb-6 text-center font-display text-xl font-bold uppercase tracking-widest text-maroon">
            {group}
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {people
              .filter((p) => p.group === group)
              .map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                  whileHover={{ y: -6 }}
                  className="float-card relative w-full sm:w-64 max-w-sm rounded-2xl border border-kasavu/15 bg-charcoal p-6 text-center overflow-hidden group/card"
                >
                  {/* Traditional Golden Corner Borders */}
                  <div className="absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 border-kasavu/50 rounded-tl-sm transition-all duration-300 group-hover/card:border-kasavu pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 border-kasavu/50 rounded-tr-sm transition-all duration-300 group-hover/card:border-kasavu pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-kasavu/50 rounded-bl-sm transition-all duration-300 group-hover/card:border-kasavu pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 border-kasavu/50 rounded-br-sm transition-all duration-300 group-hover/card:border-kasavu pointer-events-none" />
 
                  {/* Premium Profile Image with Golden Border */}
                  <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-kasavu bg-charcoal shadow-lg shadow-black/60 group-hover/card:scale-105 transition-transform duration-300">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-maroon via-red-950 to-kasavu font-display text-xl font-bold text-kasavu"
                      style={{ display: p.image ? 'none' : 'flex' }}
                    >
                      <div className="absolute inset-0.5 rounded-full border border-kasavu/10 pointer-events-none" />
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  </div>

                  <p className="font-display text-lg font-bold text-ivory tracking-wide">{p.name}</p>

                  {/* Decorative Traditional Divider */}
                  <div className="my-3.5 flex items-center justify-center gap-2">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-kasavu/30" />
                    <svg className="h-4 w-4 text-maroon animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" />
                      <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(72 12 12)" />
                      <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(144 12 12)" />
                      <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(216 12 12)" />
                      <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(288 12 12)" />
                      <circle cx="12" cy="12" r="2" fill="#D4AF37" />
                    </svg>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-kasavu/30" />
                  </div>

                  <p className="font-body text-xs uppercase tracking-widest text-kasavu/80">{p.role}</p>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
