"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let remaining = null;

      if (difference > 0) {
        remaining = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return remaining;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft === null) {
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-full text-xs font-semibold w-fit">
        <Clock className="h-3.5 w-3.5" />
        <span>Departure Passed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-950 px-3 py-1.5 rounded-full w-fit">
      <Clock className="h-3.5 w-3.5 animate-pulse text-violet-600" />
      <span className="flex items-center space-x-1">
        <span>{timeLeft.days}d</span>
        <span>:</span>
        <span>{timeLeft.hours}h</span>
        <span>:</span>
        <span>{timeLeft.minutes}m</span>
        <span>:</span>
        <span>{timeLeft.seconds}s left</span>
      </span>
    </div>
  );
}
