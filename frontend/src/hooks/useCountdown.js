import { useEffect, useState } from "react";

export function useCountdown(targetDate) {
  const target = new Date(targetDate).getTime();
  const [remaining, setRemaining] = useState(() => {
    if (Number.isNaN(target)) return 0;
    return target - Date.now();
  });

  useEffect(() => {
    if (Number.isNaN(target)) {
      setRemaining(0);
      return;
    }

    setRemaining(target - Date.now());
    const id = window.setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const clamped = Math.max(remaining, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);

  return { days, hours, minutes, seconds, done: clamped <= 0 };
}
