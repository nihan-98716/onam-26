import { useState } from "react";
import MovieBooking from "./MovieBooking.jsx";
import DJBooking from "./DJBooking.jsx";

export default function Registration({ initialTab = "movie", showTabs = true }) {
  const [tab, setTab] = useState(initialTab);

  return (
    <section id="registration" className="mx-auto max-w-5xl px-6 py-28">
      <div className="mb-12 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-kasavu/70">Book Your Spot</p>
        <h2 className="font-display text-4xl font-bold text-kasavu sm:text-5xl">Registration</h2>
      </div>

      {showTabs && (
        <div className="mb-12 flex justify-center gap-3">
          <button
            onClick={() => setTab("movie")}
            className={`rounded-full border px-6 py-2.5 font-body text-sm font-semibold transition-colors ${
              tab === "movie"
                ? "border-maroon bg-maroon text-ivory"
                : "border-kasavu/30 text-ivory/70 hover:bg-kasavu/10"
            }`}
          >
            Movie Night
          </button>
          <button
            onClick={() => setTab("dj")}
            className={`rounded-full border px-6 py-2.5 font-body text-sm font-semibold transition-colors ${
              tab === "dj"
                ? "border-maroon bg-maroon text-ivory"
                : "border-kasavu/30 text-ivory/70 hover:bg-kasavu/10"
            }`}
          >
            DJ Night
          </button>
        </div>
      )}

      {tab === "movie" ? <MovieBooking /> : <DJBooking />}
    </section>
  );
}
