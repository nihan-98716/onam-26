import { useState } from "react";

export default function RippleButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const spawnRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = {
      id: Date.now(),
      size,
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
    };
    setRipples((r) => [...r, ripple]);
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== ripple.id));
    }, 650);
  };

  const base =
    variant === "primary"
      ? "bg-maroon text-ivory hover:bg-[#611515]"
      : "border border-kasavu text-kasavu bg-transparent hover:bg-kasavu/10";

  return (
    <button
      data-cursor-lotus
      onClick={(e) => {
        spawnRipple(e);
        onClick?.(e);
      }}
      className={`ripple-btn rounded-full px-7 py-3 font-body text-sm font-semibold tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${base} ${className}`}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple"
          style={{
            width: r.size,
            height: r.size,
            left: r.x,
            top: r.y,
          }}
        />
      ))}
    </button>
  );
}
