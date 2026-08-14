import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import RippleButton from "./RippleButton.jsx";

const COLORS = [
  { id: "empty", name: "Eraser (Empty)", hex: "transparent", bg: "bg-charcoal border-white/20" },
  { id: "gold", name: "Yellow Marigold", hex: "#FFC107", bg: "bg-[#FFC107] border-white/30 shadow-[0_0_10px_rgba(255,193,7,0.4)]" },
  { id: "orange", name: "Orange Marigold", hex: "#FF5722", bg: "bg-[#FF5722] border-white/30 shadow-[0_0_10px_rgba(255,87,34,0.4)]" },
  { id: "jasmine", name: "White Jasmine", hex: "#FFFFFF", bg: "bg-[#FFFFFF] border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.4)]" },
  { id: "rose", name: "Crimson Hibiscus", hex: "#D32F2F", bg: "bg-[#D32F2F] border-white/30 shadow-[0_0_10px_rgba(211,47,47,0.4)]" },
  { id: "pink", name: "Lotus Pink", hex: "#E91E63", bg: "bg-[#E91E63] border-white/30 shadow-[0_0_10px_rgba(233,30,99,0.4)]" },
  { id: "purple", name: "Purple Amaranth", hex: "#C2185B", bg: "bg-[#C2185B] border-white/30 shadow-[0_0_10px_rgba(194,24,91,0.4)]" },
  { id: "leaves", name: "Tulsi Leaves", hex: "#1B5E20", bg: "bg-[#1B5E20] border-white/30 shadow-[0_0_10px_rgba(27,94,32,0.4)]" },
  { id: "blue", name: "Butterfly Pea (Blue)", hex: "#3F51B5", bg: "bg-[#3F51B5] border-white/30 shadow-[0_0_10px_rgba(63,81,181,0.4)]" },
];

const SYMMETRIES = [
  { id: "none", label: "Single" },
  { id: "2-fold", label: "2-Fold" },
  { id: "4-fold", label: "4-Fold" },
  { id: "8-fold", label: "8-Fold" },
  { id: "12-fold", label: "12-Fold" },
  { id: "all", label: "Fill Ring" },
];

const CANVAS_STYLES = [
  { id: "sectors", label: "Radial Wedges" },
  { id: "petals", label: "Organic Petals" },
  { id: "mosaic", label: "Mosaic Grid" },
];

// Helper to draw SVG concentric wedges paths
function getSectorPath(x, y, rInner, rOuter, startAngle, endAngle) {
  const rad = Math.PI / 180;
  const x1Inner = x + rInner * Math.cos(startAngle * rad);
  const y1Inner = y + rInner * Math.sin(startAngle * rad);
  const x1Outer = x + rOuter * Math.cos(startAngle * rad);
  const y1Outer = y + rOuter * Math.sin(startAngle * rad);

  const x2Outer = x + rOuter * Math.cos(endAngle * rad);
  const y2Outer = y + rOuter * Math.sin(endAngle * rad);
  const x2Inner = x + rInner * Math.cos(endAngle * rad);
  const y2Inner = y + rInner * Math.sin(endAngle * rad);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return `
    M ${x1Inner} ${y1Inner}
    L ${x1Outer} ${y1Outer}
    A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
    L ${x2Inner} ${y2Inner}
    A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}
    Z
  `.trim();
}

// Helper to draw SVG organic flower petal shapes
function getPetalPath(x, y, rInner, rOuter, startAngle, endAngle) {
  const rad = Math.PI / 180;
  const midAngle = (startAngle + endAngle) / 2;

  const x1 = x + rInner * Math.cos(startAngle * rad);
  const y1 = y + rInner * Math.sin(startAngle * rad);
  const x2 = x + rOuter * Math.cos(midAngle * rad);
  const y2 = y + rOuter * Math.sin(midAngle * rad);
  const x3 = x + rInner * Math.cos(endAngle * rad);
  const y3 = y + rInner * Math.sin(endAngle * rad);

  // Draws a beautiful curved leaf petal from inner center flare to outer point
  return `
    M ${x1} ${y1}
    Q ${x + (rInner + rOuter) * 0.58 * Math.cos(startAngle * rad)} ${y + (rInner + rOuter) * 0.58 * Math.sin(startAngle * rad)} ${x2} ${y2}
    Q ${x + (rInner + rOuter) * 0.58 * Math.cos(endAngle * rad)} ${y + (rInner + rOuter) * 0.58 * Math.sin(endAngle * rad)} ${x3} ${y3}
    Z
  `.trim();
}

export default function PookalamCreator() {
  const [selectedColor, setSelectedColor] = useState(COLORS[1]); // Yellow by default
  const [canvasStyle, setCanvasStyle] = useState("sectors"); // sectors, petals, mosaic
  const [symmetry, setSymmetry] = useState("8-fold");
  const [pookalam, setPookalam] = useState({});
  const svgRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  const spawnParticles = (x, y, color) => {
    if (color === "transparent" || !color) return; // Don't spawn particles for eraser
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const count = 15;
    const newParticles = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.2,
        radius: 2.5 + Math.random() * 4.5,
        alpha: 1.0,
        decay: 0.008 + Math.random() * 0.012,
        color,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    if (!animationFrameRef.current) {
      const ctx = canvas.getContext("2d");
      const update = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const active = [];
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.03; // gravity
          p.alpha -= p.decay;
          p.rotation += p.rotationSpeed;

          if (p.alpha > 0) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.beginPath();
            
            // Draw organic teardrop/petal shape
            ctx.moveTo(0, -p.radius);
            ctx.quadraticCurveTo(p.radius * 0.5, -p.radius * 0.25, 0, p.radius);
            ctx.quadraticCurveTo(-p.radius * 0.5, -p.radius * 0.25, 0, -p.radius);
            
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 3;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.restore();
            
            active.push(p);
          }
        });

        particlesRef.current = active;

        if (active.length > 0) {
          animationFrameRef.current = requestAnimationFrame(update);
        } else {
          animationFrameRef.current = null;
        }
      };
      update();
    }
  };

  // Concentric rings configuration for radial patterns - reduced to 4 rings
  const RINGS = [
    { ring: 1, rInner: 35, rOuter: 70, count: 8 },
    { ring: 2, rInner: 70, rOuter: 105, count: 16 },
    { ring: 3, rInner: 105, rOuter: 140, count: 24 },
    { ring: 4, rInner: 140, rOuter: 175, count: 32 },
  ];

  // Grid coordinates for circular mosaic grid style
  const GRID_SIZE = 14;
  const gridCells = useMemo(() => {
    const cells = [];
    const cellSize = 350 / GRID_SIZE; // width inside bounds
    const offset = 180 - 175; // center is 180, radius is 175
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cx = offset + c * cellSize + cellSize / 2;
        const cy = offset + r * cellSize + cellSize / 2;
        const dist = Math.sqrt((cx - 180) * (cx - 180) + (cy - 180) * (cy - 180));
        if (dist < 175) {
          cells.push({ r, c, x: offset + c * cellSize, y: offset + r * cellSize, size: cellSize });
        }
      }
    }
    return cells;
  }, []);

  const handleCellClick = (ring, index, count, e) => {
    if (e && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnParticles(x, y, selectedColor.hex);
    }
    const updated = { ...pookalam };
    const indicesToColor = [];

    if (ring === 0) {
      updated["center"] = selectedColor.hex === "transparent" ? null : selectedColor.hex;
    } else {
      if (symmetry === "none") {
        indicesToColor.push(index);
      } else if (symmetry === "all") {
        for (let i = 0; i < count; i++) {
          indicesToColor.push(i);
        }
      } else {
        const folds = parseInt(symmetry);
        if (!isNaN(folds)) {
          for (let i = 0; i < folds; i++) {
            const targetIndex = Math.round(index + (i * count) / folds) % count;
            indicesToColor.push(targetIndex);
          }
        }
      }

      indicesToColor.forEach((idx) => {
        const id = `${ring}-${idx}`;
        if (selectedColor.hex === "transparent") {
          delete updated[id];
        } else {
          updated[id] = selectedColor.hex;
        }
      });
    }

    setPookalam(updated);
  };

  const handleGridClick = (r, c, e) => {
    if (e && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnParticles(x, y, selectedColor.hex);
    }
    const updated = { ...pookalam };
    const coordinatesToColor = [];

    if (symmetry === "none") {
      coordinatesToColor.push({ r, c });
    } else if (symmetry === "2-fold") {
      coordinatesToColor.push({ r, c });
      coordinatesToColor.push({ r: GRID_SIZE - 1 - r, c: GRID_SIZE - 1 - c });
    } else if (symmetry === "4-fold" || symmetry === "8-fold" || symmetry === "12-fold" || symmetry === "all") {
      // Quad mirror reflection
      coordinatesToColor.push({ r, c });
      coordinatesToColor.push({ r: c, c: GRID_SIZE - 1 - r });
      coordinatesToColor.push({ r: GRID_SIZE - 1 - r, c: GRID_SIZE - 1 - c });
      coordinatesToColor.push({ r: GRID_SIZE - 1 - c, c: r });
    }

    coordinatesToColor.forEach((coord) => {
      const id = `grid-${coord.r}-${coord.c}`;
      if (selectedColor.hex === "transparent") {
        delete updated[id];
      } else {
        updated[id] = selectedColor.hex;
      }
    });

    setPookalam(updated);
  };

  const handleReset = () => {
    setPookalam({});
  };

  const loadTemplate = (name) => {
    const updated = {};
    if (canvasStyle === "mosaic") {
      // Grid style presets
      if (name === "marigold") {
        gridCells.forEach(({ r, c }) => {
          const dist = Math.sqrt((r - GRID_SIZE/2 + 0.5)**2 + (c - GRID_SIZE/2 + 0.5)**2);
          if (dist < 2.5) updated[`grid-${r}-${c}`] = "#FFC107";
          else if (dist < 4.5) updated[`grid-${r}-${c}`] = "#FF5722";
          else updated[`grid-${r}-${c}`] = "#1B5E20";
        });
      } else if (name === "lotus") {
        gridCells.forEach(({ r, c }) => {
          const checker = (r + c) % 2 === 0;
          updated[`grid-${r}-${c}`] = checker ? "#E91E63" : "#FFFFFF";
        });
      } else if (name === "spiral") {
        gridCells.forEach(({ r, c }) => {
          const sum = r + c;
          if (sum % 3 === 0) updated[`grid-${r}-${c}`] = "#C2185B";
          else if (sum % 3 === 1) updated[`grid-${r}-${c}`] = "#FFC107";
          else updated[`grid-${r}-${c}`] = "#3F51B5";
        });
      }
    } else {
      // Radial wedges & organic petals presets (reduced to 4 rings)
      if (name === "marigold") {
        updated["center"] = "#FFC107";
        for (let i = 0; i < 8; i++) updated[`1-${i}`] = "#FFC107";
        for (let i = 0; i < 16; i++) updated[`2-${i}`] = "#FF5722";
        for (let i = 0; i < 24; i++) updated[`3-${i}`] = "#FFFFFF";
        for (let i = 0; i < 32; i++) updated[`4-${i}`] = "#1B5E20";
      } else if (name === "lotus") {
        updated["center"] = "#FFFFFF";
        for (let i = 0; i < 8; i++) updated[`1-${i}`] = i % 2 === 0 ? "#E91E63" : "#FFFFFF";
        for (let i = 0; i < 16; i++) updated[`2-${i}`] = i % 2 === 0 ? "#E91E63" : "#C2185B";
        for (let i = 0; i < 24; i++) updated[`3-${i}`] = i % 3 === 0 ? "#E91E63" : "#FFFFFF";
        for (let i = 0; i < 32; i++) updated[`4-${i}`] = i % 2 === 0 ? "#1B5E20" : "#FFFFFF";
      } else if (name === "spiral") {
        updated["center"] = "#D32F2F";
        for (let i = 0; i < 8; i++) updated[`1-${i}`] = "#FFC107";
        for (let i = 0; i < 16; i++) updated[`2-${i}`] = i % 2 === 0 ? "#FF5722" : "#FFC107";
        for (let i = 0; i < 24; i++) updated[`3-${i}`] = i % 2 === 0 ? "#FFFFFF" : "#FF5722";
        for (let i = 0; i < 32; i++) updated[`4-${i}`] = i % 4 < 2 ? "#D32F2F" : "#1B5E20";
      }
    }
    setPookalam(updated);
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    
    // Clone the SVG node and inject standalone XML/SVG attributes
    const clone = svgRef.current.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("version", "1.1");
    
    const svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + clone.outerHTML;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aarpo-my-pookalam.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 border-t border-kasavu/10">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-kasavu sm:text-4xl">Concentric Digital Pookalam Creator</h2>
        <p className="mt-3 font-body text-sm text-ivory/60 max-w-2xl mx-auto">
          Create complex, premium traditional floral mandalas. Switch canvas layout geometries, 
          select petals, toggle symmetries, and export your vector SVG artwork!
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-center">
        {/* Left Side: SVG Drawing Board */}
        <div className="lg:col-span-6 flex flex-col items-center">
          {/* Canvas Style Switcher Tabs */}
          <div className="mb-6 flex gap-1 rounded-xl bg-noir p-1 border border-kasavu/20">
            {CANVAS_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  setCanvasStyle(style.id);
                  handleReset();
                }}
                className={`rounded-lg px-3.5 py-1.5 font-display text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                  canvasStyle === style.id
                    ? "bg-kasavu text-noir shadow"
                    : "text-ivory/60 hover:text-ivory"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          <div className="glass relative rounded-full p-4 border border-kasavu/20 shadow-2xl shadow-kasavu/5">
            <svg
              ref={svgRef}
              width="360"
              height="360"
              viewBox="0 0 360 360"
              className="bg-noir rounded-full select-none"
              style={{ filter: "drop-shadow(0 0 15px rgba(0, 0, 0, 0.7))" }}
            >
              {/* Base background circle for exported SVG rendering on transparent/white browsers */}
              <circle cx="180" cy="180" r="175" fill="#0a0a0a" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
              {canvasStyle !== "mosaic" && (
                <>
                  <circle cx="180" cy="180" r="140" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
                  <circle cx="180" cy="180" r="105" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
                  <circle cx="180" cy="180" r="70" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
                </>
              )}

              {/* Drawing Render Mode: Concentric Wedges */}
              {canvasStyle === "sectors" && RINGS.map(({ ring, rInner, rOuter, count }) => {
                const angleStep = 360 / count;
                return [...Array(count)].map((_, idx) => {
                  const id = `${ring}-${idx}`;
                  const startAngle = idx * angleStep;
                  const endAngle = (idx + 1) * angleStep;
                  const fillVal = pookalam[id] || "transparent";
                  const pathD = getSectorPath(180, 180, rInner, rOuter, startAngle, endAngle);

                  return (
                    <path
                      key={id}
                      d={pathD}
                      fill={fillVal}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                      className="cursor-pointer transition-colors duration-150 hover:fill-kasavu/20"
                      onClick={(e) => handleCellClick(ring, idx, count, e)}
                    />
                  );
                });
              })}

              {/* Drawing Render Mode: Organic Petals */}
              {canvasStyle === "petals" && RINGS.map(({ ring, rInner, rOuter, count }) => {
                const angleStep = 360 / count;
                return [...Array(count)].map((_, idx) => {
                  const id = `${ring}-${idx}`;
                  const startAngle = idx * angleStep;
                  const endAngle = (idx + 1) * angleStep;
                  const fillVal = pookalam[id] || "transparent";
                  const pathD = getPetalPath(180, 180, rInner, rOuter, startAngle, endAngle);

                  return (
                    <path
                      key={id}
                      d={pathD}
                      fill={fillVal}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="0.8"
                      className="cursor-pointer transition-colors duration-150 hover:fill-kasavu/20"
                      onClick={(e) => handleCellClick(ring, idx, count, e)}
                    />
                  );
                });
              })}

              {/* Drawing Render Mode: Circular Mosaic Grid */}
              {canvasStyle === "mosaic" && gridCells.map(({ r, c, x, y, size }) => {
                const id = `grid-${r}-${c}`;
                const fillVal = pookalam[id] || "transparent";

                return (
                  <rect
                    key={id}
                    x={x}
                    y={y}
                    width={size}
                    height={size}
                    fill={fillVal}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="0.8"
                    className="cursor-pointer transition-colors duration-150 hover:fill-kasavu/20"
                    onClick={(e) => handleGridClick(r, c, e)}
                  />
                );
              })}

              {/* Radial Center Circle (Only for radial modes) */}
              {canvasStyle !== "mosaic" && (
                <circle
                  cx="180"
                  cy="180"
                  r="35"
                  fill={pookalam["center"] || "transparent"}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1.2"
                  className="cursor-pointer transition-colors duration-150 hover:fill-kasavu/20"
                  onClick={(e) => handleCellClick(0, 0, 1, e)}
                />
              )}
            </svg>
            <canvas
              ref={particleCanvasRef}
              width="360"
              height="360"
              className="absolute inset-4 pointer-events-none z-20 rounded-full"
            />
            <div className="pointer-events-none absolute -inset-2 rounded-full border border-kasavu/10 animate-spin-slow" />
          </div>
        </div>

        {/* Right Side: Controls Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Preset Layouts */}
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-kasavu">
              1. Load Design Preset
            </h3>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => loadTemplate("marigold")}
                className="rounded-xl border border-kasavu/20 bg-noir px-3.5 py-2 font-body text-xs font-semibold text-kasavu hover:bg-kasavu/10 transition-all hover:scale-103"
              >
                🌼 Marigold Sunrise
              </button>
              <button
                type="button"
                onClick={() => loadTemplate("lotus")}
                className="rounded-xl border border-kasavu/20 bg-noir px-3.5 py-2 font-body text-xs font-semibold text-kasavu hover:bg-kasavu/10 transition-all hover:scale-103"
              >
                🌸 Royal Lotus Wheel
              </button>
              <button
                type="button"
                onClick={() => loadTemplate("spiral")}
                className="rounded-xl border border-kasavu/20 bg-noir px-3.5 py-2 font-body text-xs font-semibold text-kasavu hover:bg-kasavu/10 transition-all hover:scale-103"
              >
                🌀 Athachamayam Swirl
              </button>
            </div>
          </div>

          {/* Flower Palette */}
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-kasavu">
              2. Choose Flower Petal
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`flex h-11 items-center gap-2 rounded-xl border px-3 transition-all ${
                    selectedColor.id === c.id
                      ? "border-kasavu scale-[1.02] bg-kasavu/10 text-ivory"
                      : "border-kasavu/20 bg-noir text-ivory/60 hover:text-ivory hover:border-kasavu/50"
                  }`}
                  title={c.name}
                >
                  <span className={`h-4 w-4 rounded-full border ${c.bg}`} />
                  <span className="font-body text-[11px] font-semibold truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symmetry Options */}
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-kasavu">
              3. Rotational Symmetry Assist
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SYMMETRIES.map((sym) => (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => setSymmetry(sym.id)}
                  className={`rounded-xl border py-2.5 text-center font-body text-[11px] font-bold transition-all ${
                    symmetry === sym.id
                      ? "border-maroon bg-maroon/20 text-maroon shadow-md shadow-maroon/10 scale-102"
                      : "border-kasavu/20 bg-noir text-ivory/60 hover:text-ivory"
                  }`}
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Board Buttons */}
          <div className="pt-6 border-t border-kasavu/10 flex flex-col sm:flex-row gap-3">
            <RippleButton onClick={handleDownloadSVG} className="flex-1">
              💾 Export Pookalam to SVG
            </RippleButton>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 font-body text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Reset Canvas
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
