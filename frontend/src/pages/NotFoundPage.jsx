import { Link } from "react-router-dom";
import PageFrame from "../components/PageFrame.jsx";

export default function NotFoundPage() {
  return (
    <PageFrame className="flex items-center justify-center">
      <div className="mx-auto max-w-xl px-6 text-center">
        <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-kasavu">
          Page not found
        </p>
        <h1 className="mb-6 font-display text-4xl text-ivory sm:text-5xl">
          The page you’re looking for is not available.
        </h1>
        <Link
          to="/"
          className="inline-flex rounded-full border border-kasavu px-6 py-3 font-body text-sm font-semibold text-kasavu transition-colors hover:bg-kasavu/10"
        >
          Go back home
        </Link>
      </div>
    </PageFrame>
  );
}
