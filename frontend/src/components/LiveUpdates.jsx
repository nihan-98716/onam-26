import { useApi } from "../hooks/useApi.js";

export default function LiveUpdates() {
  const { data: updates } = useApi("/live-updates", []);
  const items = updates.length ? updates : [{ id: 0, text: "More announcements coming soon." }];
  const loop = [...items, ...items];

  return (
    <section id="live-updates" className="border-y border-kasavu/30 bg-maroon py-3">
      <div className="flex items-center gap-4 overflow-hidden px-6">
        <span className="flex-shrink-0 rounded-full bg-kasavu px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-maroon">
          Live
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex w-max gap-16 whitespace-nowrap font-body text-sm text-ivory"
            style={{
              animation: `ticker ${items.length * 6}s linear infinite`,
            }}
          >
            {loop.map((u, i) => (
              <span key={`${u.id}-${i}`}>{u.text}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
