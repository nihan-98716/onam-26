import { Link } from "react-router-dom";
import PageFrame from "../components/PageFrame.jsx";
import Registration from "../components/Registration.jsx";

export default function MovieEventPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-5xl px-6 py-28">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-kasavu/70">Movie Night</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-kasavu sm:text-5xl">
              Reserve your movie night seat
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-ivory/70">
              Choose a showtime, pick your seats, and secure entry to the exclusive Onam movie screening.
            </p>
          </div>
          <Link
            to="/events"
            className="group inline-flex items-center gap-2.5 rounded-full border border-kasavu/40 bg-kasavu/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-kasavu transition-all duration-300 hover:border-kasavu hover:bg-kasavu hover:text-black hover:shadow-lg hover:shadow-kasavu/25 active:scale-95 backdrop-blur-md"
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Events</span>
          </Link>
        </div>

        <Registration initialTab="movie" showTabs={false} />
      </section>
    </PageFrame>
  );
}
