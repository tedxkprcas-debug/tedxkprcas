"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./flip-countdown.css";

interface FlipCountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Single flip card digit component with animation
const FlipDigit: React.FC<{ digit: number }> = ({ digit }) => {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== displayDigit) {
      // Start flip animation
      setPreviousDigit(displayDigit);
      setIsFlipping(true);
      
      // Update digit at animation midpoint
      const midTimer = setTimeout(() => {
        setDisplayDigit(digit);
      }, 300);

      // End flip animation
      const endTimer = setTimeout(() => {
        setIsFlipping(false);
      }, 600);

      return () => {
        clearTimeout(midTimer);
        clearTimeout(endTimer);
      };
    }
  }, [digit, displayDigit]);

  return (
    <div className="flip-card">
      {/* Static top half - shows new value */}
      <div className="flip-card-top">
        <span>{digit}</span>
      </div>
      
      {/* Static bottom half - shows old value initially, then new */}
      <div className="flip-card-bottom">
        <span>{displayDigit}</span>
      </div>
      
      {/* Animated flip panel - top half flipping down */}
      <div className={`flip-card-panel ${isFlipping ? 'flip' : ''}`}>
        <div className="flip-card-panel-front">
          <span>{previousDigit}</span>
        </div>
        <div className="flip-card-panel-back">
          <span>{digit}</span>
        </div>
      </div>
    </div>
  );
};

// Group of two digits (e.g., 09 for hours)
const FlipGroup: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const tens = Math.floor(value / 10);
  const ones = value % 10;

  return (
    <div className="flip-group">
      <div className="flip-group-label">{label}</div>
      <div className="flip-group-cards">
        <FlipDigit digit={tens} />
        <FlipDigit digit={ones} />
      </div>
    </div>
  );
};

const FlipCountdown: React.FC<FlipCountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const diff = Math.max(0, target - now);

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, [targetDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  return (
    <div className="flip-countdown">
      <FlipGroup value={timeLeft.days} label="Days" />
      <div className="flip-separator">:</div>
      <FlipGroup value={timeLeft.hours} label="Hours" />
      <div className="flip-separator">:</div>
      <FlipGroup value={timeLeft.minutes} label="Minutes" />
      <div className="flip-separator">:</div>
      <FlipGroup value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default FlipCountdown;
