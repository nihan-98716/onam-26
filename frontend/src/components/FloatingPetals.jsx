import { useMemo, useEffect, useState } from "react";

function Petal({ style, scrollY, scrollFactor }) {
  return (
    <svg
      className="petal"
      style={{
        ...style,
        transform: `${style.transform} translateY(${scrollY * scrollFactor}px)`
      }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 0 C12 3 16 6 8 16 C0 6 4 3 8 0Z"
        fill={style.fill}
      />
    </svg>
  );
}

export default function FloatingPetals({ count = 10 }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const petals = useMemo(() => {
    const colors = ["#D4AF37", "#B3121C", "#8a6a1e"];
    return [...Array(count)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      fill: colors[i % colors.length],
      duration: `${10 + Math.random() * 10}s`,
      delay: `${Math.random() * 10}s`,
      scale: 0.7 + Math.random() * 0.8,
      scrollFactor: 0.15 + Math.random() * 0.35,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <Petal
          key={i}
          scrollY={scrollY}
          scrollFactor={p.scrollFactor}
          style={{
            left: p.left,
            fill: p.fill,
            animationDuration: p.duration,
            animationDelay: p.delay,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
}
