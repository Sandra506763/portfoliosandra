import React, { useEffect, useRef } from "react";
import type { Keyframe } from "../types";

const MainSection: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iLetterRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const iLetter = iLetterRef.current;
    const container = containerRef.current;

    if (!wrapper || !iLetter || !container) return;

    const rectI = iLetter.getBoundingClientRect();
    const rectContainer = container.getBoundingClientRect();

    const startX = rectI.left - rectContainer.left + rectI.width / 2 - 20;
    const startY = rectI.top - rectContainer.top - 20;

    wrapper.style.left = `${startX}px`;
    wrapper.style.top = `${startY}px`;
    wrapper.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;

    const screenWidth = window.innerWidth;

    const keyframes: Keyframe[] = [
      { x: startX, y: startY },
      { x: 300, y: 150 },
      { x: 600, y: 100 },
      { x: 900, y: 250 },
      { x: 1200, y: 150 },
      { x: 1500, y: 300 },
      { x: screenWidth - 100, y: 200 },
    ];

    const DURATION = 15000;

    function easeInOut(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    let startTime: number | null = null;
    let animationId: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      const easedT = easeInOut(t);

      const totalSegments = keyframes.length - 1;
      const segIndex = Math.floor(easedT * totalSegments);
      const segT = easedT * totalSegments - segIndex;

      const start = keyframes[segIndex];
      const end = keyframes[segIndex + 1];

      const x = start.x + (end.x - start.x) * segT;
      const y = start.y + (end.y - start.y) * segT;

      if (wrapper) {
        wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (t < 1) animationId = requestAnimationFrame(animate);
    }

    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 8000);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <main ref={containerRef}>
      <div ref={wrapperRef} className="orange-dot-wrapper">
        <div className="orange-dot"></div>
      </div>
      <p id="title">
        NO-TH
        <span ref={iLetterRef} className="i-letter">
          I
        </span>
        NG'S IMPOS-SIBLE
      </p>
    </main>
  );
};

export default MainSection;
