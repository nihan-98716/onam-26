import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../hooks/useApi.js";

const FALLBACK_LINEUP = [];

function EventIcon({ icon }) {
  switch (icon) {
    case "drum":
      return (
        <svg className="h-6 w-6 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    case "flower":
      return (
        <svg className="h-6 w-6 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M7.757 16.243l-2.121 2.121m12.728 0l-2.121-2.121M7.757 7.757L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      );
    case "crown":
      return (
        <svg className="h-6 w-6 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 16l-2-8 5 3 4-5 4 5 5-3-2 8H5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 19h14v1H5v-1z" />
        </svg>
      );
    case "dance":
      return (
        <svg className="h-6 w-6 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "music":
      return (
        <svg className="h-6 w-6 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
        </svg>
      );
    case "movie":
      return (
        <svg className="h-6 w-6 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
  }
}

const ROW_HEIGHT = 480;

function generateRiverPath(count, rowHeight) {
  let pathD = "M 500 0";
  for (let i = 0; i < count; i++) {
    const yStart = i * rowHeight;
    const yEnd = (i + 1) * rowHeight;
    if (i % 2 === 0) {
      pathD += ` C 400 ${yStart + rowHeight * 0.25}, 400 ${yStart + rowHeight * 0.75}, 500 ${yEnd}`;
    } else {
      pathD += ` C 600 ${yStart + rowHeight * 0.25}, 600 ${yStart + rowHeight * 0.75}, 500 ${yEnd}`;
    }
  }
  return pathD;
}

export default function Timeline() {
  const { data: rawItems, loading } = useApi("/timeline", FALLBACK_LINEUP);
  const items = Array.isArray(rawItems) ? rawItems : FALLBACK_LINEUP;
  
  // Cache check: Filter display items to show only Movie Night
  const displayItems = items.filter((item) => item.title === "Movie Night");
  const [filter, setFilter] = useState("all");

  const filteredItems = displayItems.filter((item) => {
    if (filter === "booking") return item.link || item.registrationRequired;
    if (filter === "main") return item.time?.includes("20 July");
    return true;
  });

  return (
    <section id="events-lineup" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <span className="inline-block rounded-full border border-kasavu/30 bg-kasavu/10 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.3em] text-kasavu backdrop-blur-md">
          AARPO'26 Event Schedule
        </span>
        <h2 className="mt-4 font-display text-4xl font-bold text-kasavu sm:text-5xl lg:text-6xl">
          The Festival Lineup
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ivory/70 sm:text-lg">
          Explore all live festival events, competitions, and entertainment nights managed by event coordinators.
        </p>

        {/* Filter Tabs (only if items exist and there is more than one) */}
        {displayItems.length > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { id: "all", label: "All Events" },
              { id: "main", label: "Main Day (20 July)" },
              { id: "booking", label: "Ticketed & Registration" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  filter === tab.id
                    ? "border border-kasavu bg-kasavu/20 text-kasavu shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                    : "border border-white/10 bg-white/5 text-ivory/60 hover:border-kasavu/40 hover:text-ivory"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading state or Empty State when no events exist */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-kasavu border-t-transparent" />
        </div>
      ) : displayItems.length === 0 ? (
        <div className="mx-auto my-12 max-w-xl rounded-3xl border border-dashed border-kasavu/30 bg-black/40 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-kasavu/30 bg-kasavu/10">
            <svg className="h-8 w-8 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold text-ivory">No Events Scheduled</h3>
          <p className="mt-2 text-sm text-ivory/60">
            Check back later for updates on the festival lineup.
          </p>
        </div>
      ) : (
        /* Alternating Vertical Timeline with Glowing Kasavu Thread */
        <div className="relative mx-auto mt-16 max-w-5xl px-4">
          {/* Straight guideline for mobile timeline */}
          <div className="absolute left-6 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-kasavu/35 md:hidden pointer-events-none z-0" />

          {/* Single Continuous Wavy Kasavu River Path (desktop only) */}
          <svg
            className="absolute left-0 right-0 top-0 bottom-0 w-full h-full hidden md:block pointer-events-none z-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 1000 ${filteredItems.length * ROW_HEIGHT}`}
            preserveAspectRatio="none"
          >
            <path
              d={generateRiverPath(filteredItems.length, ROW_HEIGHT)}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="4.5"
              style={{ filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.8))" }}
            />
            <path
              d={generateRiverPath(filteredItems.length, ROW_HEIGHT)}
              fill="none"
              stroke="#B3121C"
              strokeWidth="2.5"
              strokeDasharray="4,4"
            />
          </svg>

          <motion.div layout className="space-y-0">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const targetLink = item.link || (item.registrationRequired ? `/events/${item.id}/register` : null);
                const isBooking = Boolean(targetLink);
                const CardWrapper = isBooking ? Link : "div";
                const wrapperProps = isBooking ? { to: targetLink } : {};

                return (
                  <motion.div
                    key={item.id || item.title}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className={`relative flex flex-col md:flex-row items-center justify-between w-full py-8 md:py-0 md:h-[480px] ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Event Card Container */}
                    <div className="w-full md:w-[45%] flex flex-col pl-12 md:pl-0">
                      <CardWrapper
                        {...wrapperProps}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-all duration-500 ${
                          isBooking
                            ? "border-kasavu/40 bg-gradient-to-b from-maroon/20 via-black/80 to-black/90 shadow-[0_4px_25px_rgba(179,18,28,0.15)] hover:-translate-y-2 hover:border-kasavu hover:shadow-[0_12px_35px_rgba(212,175,55,0.3)] cursor-pointer"
                            : "border-white/10 bg-black/60 backdrop-blur-xl hover:-translate-y-2 hover:border-kasavu/60 hover:bg-black/80 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                        }`}
                      >
                        {/* Top Ambient Glow */}
                        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-kasavu/10 blur-2xl transition-all duration-500 group-hover:bg-kasavu/25" />

                        <div>
                          {/* Poster Image Container */}
                          <div className="relative mb-5 h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner">
                            {item.poster ? (
                              <img
                                src={item.poster}
                                alt={item.title}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const fallback = e.currentTarget.parentElement.querySelector(".poster-fallback");
                                  if (fallback) fallback.classList.remove("hidden");
                                }}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : null}

                            {/* Poster Fallback Frame */}
                            <div
                              className={`poster-fallback flex h-full w-full flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-kasavu/15 via-black/80 to-maroon/20 ${
                                item.poster ? "hidden" : ""
                              }`}
                            >
                              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-kasavu/30 bg-kasavu/10">
                                <EventIcon icon={item.icon} />
                              </div>
                              <span className="font-body text-[11px] font-bold tracking-widest text-kasavu/80 uppercase">
                                Event Poster Frame
                              </span>
                            </div>

                            {/* Time Tag Overlay */}
                            <span className="absolute right-3 top-3 rounded-full border border-black/40 bg-black/80 px-3 py-1 font-body text-xs font-semibold text-kasavu backdrop-blur-md shadow-md">
                              {item.time}
                            </span>
                          </div>

                          {/* Category Pill */}
                          {item.category && (
                            <span className="mb-2 inline-block font-body text-[10px] uppercase tracking-[0.25em] text-maroon font-bold">
                              {item.category}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="mb-3 font-display text-2xl font-bold text-ivory transition-colors duration-300 group-hover:text-kasavu">
                            {item.title}
                          </h3>

                          {/* Description */}
                          <p className="mb-6 font-body text-sm leading-relaxed text-ivory/70">
                            {item.description}
                          </p>
                        </div>

                        {/* Footer Details / Action */}
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1.5 text-xs text-ivory/50">
                            <svg className="h-4 w-4 text-kasavu/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{item.venue || "Campus Venue"}</span>
                          </div>

                          {isBooking ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-kasavu/40 bg-kasavu/20 px-4 py-1.5 text-xs font-bold text-kasavu shadow-sm transition-all duration-300 group-hover:bg-kasavu group-hover:text-black">
                              {item.badge || (item.registrationRequired ? (item.paymentRequired ? `Register • ₹${item.price}` : "Register Free") : "Book Ticket")}
                              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-kasavu/70 group-hover:text-kasavu">
                              Open Entry
                            </span>
                          )}
                        </div>
                      </CardWrapper>
                    </div>

                    {/* Wavy Placement Event Node (sits on the apex of the Bezier wave segment) */}
                    <div className={`absolute left-6 top-4 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-kasavu bg-noir shadow-lg shadow-black/80 z-10 transition-transform duration-300 hover:scale-110 ${
                      index % 2 === 0 ? "md:left-[42.5%]" : "md:left-[57.5%]"
                    }`}>
                      <div className="h-7 w-7 flex items-center justify-center bg-kasavu/10 border border-kasavu/30 rounded-full">
                        <EventIcon icon={item.icon} />
                      </div>
                    </div>

                    {/* Spacer Column */}
                    <div className="hidden md:block w-[45%]" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </section>
  );
}
