import { useState, useRef, useEffect } from "react";

export default function KathakaliTheyyam() {
  const [sliderPos, setSliderPos] = useState(50); // percentage, 0 to 100
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1 || isDragging) {
      handleMove(e.clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center select-none sm:h-[440px] sm:w-[440px] md:h-[520px] md:w-[520px] overflow-hidden rounded-3xl border border-kasavu/10 bg-black/40 shadow-2xl cursor-ew-resize"
    >
      {/* Background glow based on slider position */}
      <div 
        style={{
          background: `radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(179,18,28,0.2) 100%)`,
        }}
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Kathakali face - Full Background */}
      <img
        src="/images/kathakali.png"
        alt="Kathakali face"
        className="absolute h-full w-full object-contain drop-shadow-[0_0_25px_rgba(179,18,28,0.3)] pointer-events-none"
      />

      {/* Theyyam face - Left (clipped by width percentage) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src="/images/theyyam.png"
          alt="Theyyam face"
          style={{ width: "320px", maxWidth: "none" }}
          className="absolute inset-0 h-full object-contain drop-shadow-[0_0_35px_rgba(212,175,55,0.4)] pointer-events-none sm:w-[440px] md:w-[520px]"
        />
      </div>

      {/* Golden Slider Handle Line */}
      <div
        style={{ left: `${sliderPos}%` }}
        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-kasavu/20 via-kasavu to-kasavu/20 cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Golden Lotus Medallion Handle */}
        <div className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-kasavu bg-noir flex items-center justify-center shadow-lg shadow-black/80 hover:scale-110 active:scale-95 transition-transform duration-200">
          <svg className="h-6 w-6 text-kasavu animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" />
            <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(72 12 12)" />
            <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(144 12 12)" />
            <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(216 12 12)" />
            <path d="M12 2 C14 7 14 10 12 13 C10 10 10 7 12 2Z" transform="rotate(288 12 12)" />
            <circle cx="12" cy="12" r="2" fill="#B3121C" />
          </svg>
        </div>
      </div>
    </div>
  );
}
