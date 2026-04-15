"use client";

import { useEffect, useState } from "react";

export function useExamTimer(startTime: string, duration: number) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [status, setStatus] = useState<"waiting" | "active" | "ended">(
    "waiting"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = start + duration * 60000;

      if (now < start) {
        setStatus("waiting");
        setTimeLeft(Math.floor((start - now) / 1000));
      } else if (now >= start && now <= end) {
        setStatus("active");
        setTimeLeft(Math.floor((end - now) / 1000));
      } else {
        setStatus("ended");
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration]);

  return { timeLeft, status };
}