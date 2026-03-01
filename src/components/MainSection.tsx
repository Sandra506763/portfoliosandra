import React, { useEffect, useRef } from "react";

const BREAKPOINT_PX = 768;

const MainSection: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iLetterRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const iLetter = iLetterRef.current;
    const container = containerRef.current;

    if (!wrapper || !iLetter || !container) return;

    const ball = wrapper.querySelector(".orange-dot") as HTMLElement | null;
    if (!ball) return;

    let rafId: number | null = null;
    let startTimeoutId: number | null = null;
    let isRunning = false;

    const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
    const easeInQuad = (t: number) => t * t;
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const placeOnI = () => {
      const rectI = iLetter.getBoundingClientRect();
      const rectC = container.getBoundingClientRect();

      const isMobile = window.innerWidth <= BREAKPOINT_PX;
      const dotSize = ball.offsetWidth || 40;

      const xCenter = rectI.left - rectC.left + rectI.width / 2;

      
      const yTopLine = rectI.top - rectC.top - (isMobile ? 10 : 20);

      wrapper.style.left = `${xCenter - dotSize / 2}px`;
      wrapper.style.top = `${yTopLine}px`;
      wrapper.style.transform = "translate3d(0,0,0)";
      wrapper.style.display = "block";
      wrapper.style.opacity = "1";
      wrapper.style.zIndex = "10";

      ball.style.transform = "translateX(0px) rotate(0deg) scale(1,1)";
    };

    const getGroundDY = (startTop: number) => {
      const cs = getComputedStyle(container);
      const padBottom = parseFloat(cs.paddingBottom || "0") || 0;
      const dotSize = ball.offsetWidth || 40;

      
      const groundY = container.clientHeight - padBottom - dotSize;

      return Math.max(0, groundY - startTop);
    };

    placeOnI();


    const onResize = () => {
      if (!isRunning) placeOnI();
    };
    window.addEventListener("resize", onResize);

    const phases = {
      pulse: 2600,
      rollTop: 4200,
      fall: 1700,
      bounce: 2900,
      rollOut: 12000,
    };

    startTimeoutId = window.setTimeout(() => {
      isRunning = true;

     
      const startTop = parseFloat(wrapper.style.top || "0") || 0;
      const groundDY = getGroundDY(startTop);

      const startTime = performance.now();
      const isMobile = window.innerWidth <= BREAKPOINT_PX;

      const topRollDX = isMobile ? 140 : 220;
      const bounces = 5;
      const bounceStepX = isMobile ? 48 : 70;

      const animate = (now: number) => {
        const tAll = now - startTime;

        let dx = 0;
        let dy = 0;
        let rotation = 0;
        let scaleX = 1;
        let scaleY = 1;

        if (tAll < phases.pulse) {
          const t = tAll / phases.pulse;
          const wobble = Math.sin(t * Math.PI * 2) * 0.04;
          scaleX = 1 + wobble;
          scaleY = 1 - wobble;

          wrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          ball.style.transform = `translateX(0px) rotate(0deg) scale(${scaleX}, ${scaleY})`;

          rafId = requestAnimationFrame(animate);
          return;
        }

        
        const t2 = tAll - phases.pulse;
        if (t2 < phases.rollTop) {
          const t = clamp01(t2 / phases.rollTop);
          const eased = easeInOutCubic(t);

          dx = topRollDX * eased;
          rotation = eased * 260;

          wrapper.style.transform = `translate3d(${dx}px, 0px, 0)`;
          ball.style.transform = `translateX(0px) rotate(${rotation}deg) scale(1,1)`;

          rafId = requestAnimationFrame(animate);
          return;
        }


        const t3 = t2 - phases.rollTop;
        if (t3 < phases.fall) {
          const t = clamp01(t3 / phases.fall);
          const eased = easeInQuad(t);

          dx = topRollDX;
          dy = groundDY * eased;
          rotation = 260 + eased * 120;

          if (t > 0.92) {
            const p = (t - 0.92) / 0.08;
            scaleX = 1 + 0.18 * p;
            scaleY = 1 - 0.26 * p;
          }

          wrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          ball.style.transform = `translateX(0px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;

          rafId = requestAnimationFrame(animate);
          return;
        }

     
        const t4 = t3 - phases.fall;
        if (t4 < phases.bounce) {
          const t = clamp01(t4 / phases.bounce);

          const prog = t * bounces;
          const idx = Math.floor(prog);
          const localT = prog - idx;

          let bounceDX = topRollDX;
          for (let i = 0; i < idx; i++) bounceDX += bounceStepX + i * 10;
          bounceDX += (bounceStepX + idx * 10) * localT;

          const baseY = groundDY;
          const initialH = isMobile ? 120 : 150;
          const h = initialH * Math.pow(0.58, idx);
          const curve = Math.sin(Math.PI * localT);

          dx = bounceDX;
          dy = baseY - h * curve;
          rotation = 380 + (idx + localT) * 220;

          if (curve < 0.12) {
            const p = 1 - curve / 0.12;
            scaleX = 1 + 0.12 * p;
            scaleY = 1 - 0.18 * p;
          }

          wrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          ball.style.transform = `translateX(0px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;

          rafId = requestAnimationFrame(animate);
          return;
        }

  
        const t5 = t4 - phases.bounce;
        if (t5 < phases.rollOut) {
          const t = clamp01(t5 / phases.rollOut);
          const eased = easeOutQuad(t);

          let endBounceDX = topRollDX;
          for (let i = 0; i < bounces; i++) endBounceDX += bounceStepX + i * 10;

          const totalOut = isMobile ? 700 : 1600;

          dx = endBounceDX + totalOut * eased;
          dy = groundDY;
          rotation = 900 + eased * 1400;

          wrapper.style.opacity = `${1 - Math.max(0, (t - 0.88) / 0.12)}`;
          wrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          ball.style.transform = `translateX(0px) rotate(${rotation}deg) scale(1,1)`;

          rafId = requestAnimationFrame(animate);
          return;
        }

        wrapper.style.display = "none";
        isRunning = false;
      };

      rafId = requestAnimationFrame(animate);
    }, 9000);

    return () => {
      window.removeEventListener("resize", onResize);
      if (startTimeoutId) window.clearTimeout(startTimeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main ref={containerRef} className="homeBallStage">
      <div ref={wrapperRef} className="orange-dot-wrapper" style={{ display: "none" }}>
        <div className="orange-dot" />
      </div>

      <p id="title">
        NO-TH
        <span ref={iLetterRef} className="i-letter">
          I
        </span>
        NG&apos;S IMPOS-SIBLE
      </p>
    </main>
  );
};

export default MainSection;