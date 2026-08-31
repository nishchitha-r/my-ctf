"use client";

import { useEffect, useState } from "react";

type Competition = {
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number;
};

export default function CompetitionTimer() {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    let endTime: number | null = null;

    async function loadCompetition() {
      try {
        const response = await fetch("/api/competition", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          endTime = null;
          setRemaining(0);
          return;
        }

        const competition: Competition = data.competition;

        if (
          !competition.start_time ||
          !competition.end_time
        ) {
          endTime = null;
          setRemaining(0);
          return;
        }

        const startTime = new Date(
          competition.start_time
        ).getTime();

        const competitionEndTime = new Date(
          competition.end_time
        ).getTime();

        const now = Date.now();

        if (now < startTime) {
          endTime = null;
          setRemaining(0);
          return;
        }

        if (now >= competitionEndTime) {
          endTime = null;
          setRemaining(0);
          return;
        }

        endTime = competitionEndTime;

        setRemaining(
          Math.floor(
            (competitionEndTime - now) / 1000
          )
        );
      } catch (error) {
        console.error("Timer error:", error);

        endTime = null;
        setRemaining(0);
      }
    }

    loadCompetition();

    // Check START/STOP status every 5 seconds
    const pollInterval = setInterval(() => {
      loadCompetition();
    }, 5000);

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      if (endTime === null) {
        return;
      }

      const now = Date.now();

      const left = Math.max(
        Math.floor((endTime - now) / 1000),
        0
      );

      setRemaining(left);
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const hours = Math.floor(
    remaining / 3600
  );

  const minutes = Math.floor(
    (remaining % 3600) / 60
  );

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