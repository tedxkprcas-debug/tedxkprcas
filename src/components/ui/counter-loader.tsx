"use client";
import React from "react";
import styled from "styled-components";

/**
 * Digit patterns for 0–9 on a 3×5 grid (15 cells).
 * true = block visible, false = block hidden.
 *
 * Layout:
 *  [ 0][ 1][ 2]
 *  [ 3][ 4][ 5]
 *  [ 6][ 7][ 8]
 *  [ 9][10][11]
 *  [12][13][14]
 */
const DIGIT_PATTERNS: boolean[][] = [
  /* 0 */ [true,true,true, true,false,true, true,false,true, true,false,true, true,true,true],
  /* 1 */ [false,false,true, false,false,true, false,false,true, false,false,true, false,false,true],
  /* 2 */ [true,true,true, false,false,true, true,true,true, true,false,false, true,true,true],
  /* 3 */ [true,true,true, false,false,true, true,true,true, false,false,true, true,true,true],
  /* 4 */ [true,false,true, true,false,true, true,true,true, false,false,true, false,false,true],
  /* 5 */ [true,true,true, true,false,false, true,true,true, false,false,true, true,true,true],
  /* 6 */ [true,true,true, true,false,false, true,true,true, true,false,true, true,true,true],
  /* 7 */ [true,true,true, false,false,true, false,true,false, false,true,false, false,true,false],
  /* 8 */ [true,true,true, true,false,true, true,true,true, true,false,true, true,true,true],
  /* 9 */ [true,true,true, true,false,true, true,true,true, false,false,true, true,true,true],
];

/* ── Single Digit ── */

interface CounterDigitProps {
  digit: number;
  color?: string;
  size?: number;
}

const CounterDigit: React.FC<CounterDigitProps> = ({
  digit,
  color = "#d71616",
  size = 20,
}) => {
  const pattern = DIGIT_PATTERNS[digit] ?? DIGIT_PATTERNS[0];
  const gap = Math.max(2, Math.round(size * 0.16));
  const radius = Math.max(2, Math.round(size * 0.2));

  return (
    <DigitGrid $size={size} $gap={gap}>
      {pattern.map((on, i) => (
        <Cell key={i} $on={on} $color={color} $radius={radius} />
      ))}
    </DigitGrid>
  );
};

const DigitGrid = styled.div<{ $size: number; $gap: number }>`
  display: grid;
  grid-template-columns: repeat(3, ${(p) => p.$size}px);
  grid-template-rows: repeat(5, ${(p) => p.$size}px);
  gap: ${(p) => p.$gap}px;
`;

const Cell = styled.div<{ $on: boolean; $color: string; $radius: number }>`
  border-radius: ${(p) => p.$radius}px;
  background-color: ${(p) => (p.$on ? p.$color : "transparent")};
  opacity: ${(p) => (p.$on ? 1 : 0)};
  transform: scale(${(p) => (p.$on ? 1 : 0.4)});
  transition: opacity 0.35s ease, transform 0.35s ease, background-color 0.35s ease;
`;

/* ── Two-Digit Pair (e.g. "05") ── */

interface CounterPairProps {
  value: number;
  color?: string;
  size?: number;
  label?: string;
}

const CounterPair: React.FC<CounterPairProps> = ({
  value,
  color = "#e62121",
  size = 20,
  label,
}) => {
  const tens = Math.floor((value % 100) / 10);
  const ones = value % 10;

  return (
    <PairWrapper>
      <div className="pair-digits">
        <CounterDigit digit={tens} color={color} size={size} />
        <CounterDigit digit={ones} color={color} size={size} />
      </div>
      {label && <span className="pair-label">{label}</span>}
    </PairWrapper>
  );
};

const PairWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .pair-digits {
    display: flex;
    gap: 4px;
  }

  .pair-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (min-width: 640px) {
    gap: 12px;
    .pair-digits { gap: 10px; }
    .pair-label { font-size: 0.9rem; }
  }

  @media (min-width: 768px) {
    gap: 14px;
    .pair-digits { gap: 12px; }
    .pair-label { font-size: 1.05rem; letter-spacing: 0.22em; }
  }
`;

/* ── Full Countdown Display ── */

interface CountdownCounterProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  color?: string;
  size?: number;
}

const CountdownCounter: React.FC<CountdownCounterProps> = ({
  days,
  hours,
  minutes,
  seconds,
  color = "#e82b2b",
  size = 20,
}) => {
  return (
    <CountdownWrapper $color={color} $size={size}>
      <CounterPair value={days} color={color} size={size} label="Days" />
      <div className="separator-col">
        <span className="dot" />
        <span className="dot" />
      </div>
      <CounterPair value={hours} color={color} size={size} label="Hours" />
      <div className="separator-col">
        <span className="dot" />
        <span className="dot" />
      </div>
      <CounterPair value={minutes} color={color} size={size} label="Min" />
      <div className="separator-col">
        <span className="dot" />
        <span className="dot" />
      </div>
      <CounterPair value={seconds} color={color} size={size} label="Sec" />
    </CountdownWrapper>
  );
};

const CountdownWrapper = styled.div<{ $color: string; $size: number }>`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;

  .separator-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${(p) => p.$size * 1.2}px;
    height: ${(p) => p.$size * 5 + Math.max(2, Math.round(p.$size * 0.16)) * 4}px;
    user-select: none;
  }

  .dot {
    display: block;
    width: ${(p) => Math.max(6, Math.round(p.$size * 0.4))}px;
    height: ${(p) => Math.max(6, Math.round(p.$size * 0.4))}px;
    border-radius: 50%;
    background-color: ${(p) => p.$color};
  }

  @media (min-width: 640px) {
    gap: 24px;
  }

  @media (min-width: 768px) {
    gap: 32px;
  }
`;

export { CounterDigit, CounterPair, CountdownCounter };
export default CountdownCounter;
