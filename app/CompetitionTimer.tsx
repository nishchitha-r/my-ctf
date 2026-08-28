"use client";

import { useEffect, useState } from "react";

const COMPETITION_DURATION = 2 * 60 * 60;

export default function CompetitionTimer() {
  const [remaining, setRemaining] = useState(COMPETITION_DURATION);

  useEffect(() => {
    const startKey = "null-drop-start-time";

    let startTime = localStorage.getItem(startKey);

    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(startKey, startTime);
    }

    const start = Number(startTime);

    function updateTimer() {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const left = Math.max(COMPETITION_DURATION - elapsed, 0);

      setRemaining(left);
    }

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const formattedTime =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  return (
    <div className="border border-green-500 px-4 py-2 font-mono">
      <div className="text-[9px] tracking-[0.2em] text-green-700">
        TIME REMAINING
      </div>

      <div className="text-lg font-bold tracking-widest text-green-400">
        {formattedTime}
      </div>
    </div>
  );
}