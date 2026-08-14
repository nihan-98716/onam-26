import { useEffect, useRef, useState } from "react";

export default function LotusCursor() {
  const ref = useRef(null);
  const [hoveringImportant, setHoveringImportant] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%) scale(${
          hoveringImportant ? 1.6 : 1
        })`;
      }
    };
    const over = (e) => {
      setHoveringImportant(!!e.target.closest("[data-cursor-lotus]"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [hoveringImportant]);

  return (
    <svg
      ref={ref}
      className="lotus-cursor hidden md:block"
      viewBox="0 0 24 24"
      style={{ transition: "transform 0.12s ease-out" }}
    >
      <g fill="#B3121C" opacity="0.95">
        <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" />
        <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(72 12 12)" />
        <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(144 12 12)" />
        <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(216 12 12)" />
        <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(288 12 12)" />
      </g>
      <circle cx="12" cy="12" r="2" fill="#D4AF37" />
    </svg>
  );
}
