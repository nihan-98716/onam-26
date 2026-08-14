import { useState, useEffect, useRef } from "react";

export default function SeatMap({ rows, seats, selected, onToggle, genderFilter = "male", onGenderFilterChange }) {
  const [scale, setScale] = useState(1);
  const [mapHeight, setMapHeight] = useState(0);
  const containerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && innerRef.current) {
        // Subtract 24px of safety padding to prevent edge seats from getting cut off on mobile/tablets
        const parentWidth = containerRef.current.clientWidth - 24;
        const innerWidth = 1180; // The actual maximum width of Row J when fully rendered
        const s = parentWidth < innerWidth ? parentWidth / innerWidth : 1;
        setScale(s);
        setMapHeight(innerRef.current.clientHeight * s);
      }
    };
    
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    handleResize();
    return () => observer.disconnect();
  }, []);

  const byRow = rows.map((r) => ({
    ...r,
    left: seats.filter((s) => s.row === r.row && s.side === "left").sort((a, b) => a.number - b.number),
    right: seats.filter((s) => s.row === r.row && s.side === "right").sort((a, b) => a.number - b.number),
  }));

  const isSeatDisabled = (seat) => {
    if (seat.booked) return true;
    if (genderFilter === "male" && seat.side === "right") return true;
    if (genderFilter === "female" && seat.side === "left") return true;
    return false;
  };

  const Seat = ({ seat }) => {
    const isSelected = selected.includes(seat.id);
    const disabled = isSeatDisabled(seat);
    const sideMismatch =
      (genderFilter === "male" && seat.side === "right") ||
      (genderFilter === "female" && seat.side === "left");

    const base =
      "h-5 w-5 sm:h-6 sm:w-6 rounded-sm text-[8px] flex items-center justify-center transition-all border";
    let style;
    if (seat.booked) {
      style = "bg-charcoal border-charcoal text-ivory/20 cursor-not-allowed opacity-50";
    } else if (sideMismatch) {
      style = "bg-black/30 border-white/10 text-ivory/20 cursor-not-allowed opacity-30";
    } else if (isSelected) {
      style = "bg-kasavu border-kasavu text-noir font-bold shadow-md shadow-kasavu/30 scale-105";
    } else if (seat.tier === "near") {
      style = "bg-transparent border-maroon/60 text-maroon/80 hover:bg-maroon/20 cursor-pointer";
    } else {
      style = "bg-transparent border-kasavu/40 text-kasavu/70 hover:bg-kasavu/15 cursor-pointer";
    }

    const titleText = sideMismatch
      ? `Row ${seat.row} · Seat ${seat.number} (${seat.side === "left" ? "Male Section" : "Female Section"})`
      : `Row ${seat.row} · Seat ${seat.number} · ₹${seat.price} (${seat.side === "left" ? "Male" : "Female"})`;

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onToggle(seat)}
        className={`${base} ${style}`}
        title={titleText}
      >
        {seat.number}
      </button>
    );
  };

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* Gender Filter Controls */}
      {onGenderFilterChange && (
        <div className="mb-6 flex flex-col items-center gap-2">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-ivory/70">
            Filter Seats by Gender Section
          </p>
          <div className="inline-flex rounded-full border border-kasavu/30 bg-black/40 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => onGenderFilterChange("male")}
              className={`rounded-full px-4 py-1.5 font-body text-xs font-semibold transition-all ${
                genderFilter === "male"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-ivory/70 hover:text-ivory"
              }`}
            >
              Male Seats (Left)
            </button>
            <button
              type="button"
              onClick={() => onGenderFilterChange("female")}
              className={`rounded-full px-4 py-1.5 font-body text-xs font-semibold transition-all ${
                genderFilter === "female"
                  ? "bg-pink-600 text-white shadow-md"
                  : "text-ivory/70 hover:text-ivory"
              }`}
            >
              Female Seats (Right)
            </button>
          </div>
          <p className="mt-2 max-w-xl text-center font-body text-[11px] leading-relaxed text-red-400 font-medium px-4">
            ⚠️ <strong>Terms &amp; Conditions:</strong> Guys should book only the seats allocated for MALE, and girls should book the seats allocated for FEMALE. If any discrepencies are found, your ticket will be liable to cancellation.
          </p>
        </div>
      )}

      {/* Screen Indicator */}
      <div className="mx-auto mb-6 w-full max-w-2xl rounded-b-full bg-gradient-to-b from-kasavu/50 to-transparent py-2 text-center font-body text-xs uppercase tracking-[0.3em] text-kasavu/80">
        Screen this way
      </div>

      <div
        style={{
          height: mapHeight ? `${mapHeight}px` : "auto",
          overflow: "hidden",
          transition: "height 0.2s ease"
        }}
      >
        <div
          ref={innerRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: "1180px",
            position: "relative",
            left: "50%",
            marginLeft: "-590px",
            transition: "transform 0.2s ease"
          }}
          className="flex flex-col items-center gap-1.5 animate-fadeIn"
        >
          {/* Gender Section Header Bar */}
          <div className="mb-2 flex items-center justify-between w-full max-w-[1100px] px-8 text-xs font-bold font-body">
            <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
              <span>Male Section (Left)</span>
            </div>
            <div className="flex items-center gap-1.5 text-pink-400 bg-pink-500/10 border border-pink-500/30 px-3 py-1 rounded-full">
              <span>Female Section (Right)</span>
            </div>
          </div>

          {byRow.map(({ row, left, right }) => (
            <div key={row} className="flex items-center gap-4">
              <span className="w-4 font-body text-xs text-ivory/40">{row}</span>
              <div className="flex gap-1 p-1 rounded-lg bg-blue-950/20 border border-blue-500/15">
                {left.map((s) => (
                  <Seat key={s.id} seat={s} />
                ))}
              </div>
              <div className="flex flex-col items-center justify-center w-6">
                <div className="h-full w-[1px] bg-kasavu/20" />
              </div> {/* aisle */}
              <div className="flex gap-1 p-1 rounded-lg bg-pink-950/20 border border-pink-500/15">
                {right.map((s) => (
                  <Seat key={s.id} seat={s} />
                ))}
              </div>
              <span className="w-4 font-body text-xs text-ivory/40">{row}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-5 font-body text-xs text-ivory/60">
        <Legend swatchClass="border border-blue-500/40 bg-blue-500/10" label="Male Seats (Left)" />
        <Legend swatchClass="border border-pink-500/40 bg-pink-500/10" label="Female Seats (Right)" />
        <Legend swatchClass="border border-maroon/60" label="Near screen · ₹70" />
        <Legend swatchClass="border border-kasavu/40" label="Away from screen · ₹100" />
        <Legend swatchClass="bg-kasavu" label="Selected" />
        <Legend swatchClass="bg-charcoal" label="Already booked" />
      </div>
    </div>
  );
}

function Legend({ swatchClass, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${swatchClass}`} />
      {label}
    </div>
  );
}

