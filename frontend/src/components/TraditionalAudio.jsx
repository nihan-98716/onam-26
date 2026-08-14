import { useEffect, useRef, useState } from "react";

export default function TraditionalAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalIdRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const beatRef = useRef(0);

  const tempo = 92; // BPM for a steady traditional tempo
  const scheduleAheadTime = 0.12; // seconds
  const lookahead = 25.0; // ms

  const playBassDrum = (time, intensity = 1.0) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Synthesize Chenda bass (Uruttu Chenda / Valanthalai)
    osc.frequency.setValueAtTime(115, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.18);
    
    gain.gain.setValueAtTime(0.65 * intensity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    
    osc.start(time);
    osc.stop(time + 0.25);
  };

  const playElathalam = (time, intensity = 0.5) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Synthesize brass bell sound using high frequencies
    const frequencies = [820, 1050, 2150, 3120, 4210];
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.15 * intensity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.38);

    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.connect(gain);
      osc.start(time);
      osc.stop(time + 0.42);
    });
  };

  const scheduler = () => {
    const ctx = audioCtxRef.current;
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      scheduleNote(beatRef.current, nextNoteTimeRef.current);
      const secondsPerBeat = 60.0 / tempo;
      nextNoteTimeRef.current += 0.5 * secondsPerBeat; // 8th note spacing
      beatRef.current = (beatRef.current + 1) % 8;
    }
  };

  const scheduleNote = (beat, time) => {
    // 8th-note traditional Chendamelam pattern
    if (beat === 0) {
      playBassDrum(time, 1.0);
      playElathalam(time, 0.7);
    } else if (beat === 1) {
      playBassDrum(time, 0.3);
    } else if (beat === 2) {
      playBassDrum(time, 0.6);
      playElathalam(time, 0.4);
    } else if (beat === 3) {
      playBassDrum(time, 0.3);
    } else if (beat === 4) {
      playBassDrum(time, 0.9);
      playElathalam(time, 0.6);
    } else if (beat === 5) {
      playBassDrum(time, 0.4);
    } else if (beat === 6) {
      playBassDrum(time, 0.7);
      playElathalam(time, 0.5);
    } else if (beat === 7) {
      playBassDrum(time, 0.4);
      playBassDrum(time + 0.1, 0.3); // rapid double hit
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      clearInterval(intervalIdRef.current);
      setIsPlaying(false);
    } else {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
      beatRef.current = 0;
      intervalIdRef.current = setInterval(scheduler, 25.0);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={togglePlayback}
        className={`glass float-card flex h-12 w-12 items-center justify-center rounded-full border shadow-xl transition-all duration-300 ${
          isPlaying
            ? "border-maroon bg-maroon/20 text-maroon animate-pulse"
            : "border-kasavu/30 bg-black/80 text-kasavu/80 hover:text-kasavu"
        }`}
        title={isPlaying ? "Mute Background Beats" : "Play Traditional Onam Beats"}
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 bg-maroon animate-[musicBar_0.8s_ease-in-out_infinite]" style={{ height: "100%", animationDelay: "0s" }} />
            <span className="w-1 bg-maroon animate-[musicBar_0.8s_ease-in-out_infinite]" style={{ height: "60%", animationDelay: "0.15s" }} />
            <span className="w-1 bg-maroon animate-[musicBar_0.8s_ease-in-out_infinite]" style={{ height: "80%", animationDelay: "0.3s" }} />
          </div>
        ) : (
          <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        )}
      </button>
    </div>
  );
}
