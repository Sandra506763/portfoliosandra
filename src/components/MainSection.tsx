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

    const rectI = iLetter.getBoundingClientRect();
    const rectContainer = container.getBoundingClientRect();

    const isMobileAtStart = window.innerWidth <= BREAKPOINT_PX;

    // ✅ Originalwerte (wie bei dir funktionierend)
    const I_EDGE_OFFSET = 33;
    const MOBILE_X_OFFSET = isMobileAtStart ? 47 : 0;

    // ✅ Start: bei dir perfekt über dem I
    const startX =
      rectI.left - rectContainer.left + rectI.width / 2 - 66 + MOBILE_X_OFFSET;

    const startY = rectI.top - rectContainer.top - (isMobileAtStart ? 10 : 20);

    wrapper.style.left = `${startX}px`;
    wrapper.style.top = `${startY}px`;
    wrapper.style.transform = "translate3d(0,0,0)";
    wrapper.style.display = "block";
    wrapper.style.zIndex = "10";
    wrapper.style.opacity = "1";

    let rafId: number | null = null;

    // ✅ Desktop "Impact"-Impuls (macht das Aufkommen natürlicher wie auf Mobile)
    let impactAt: number | null = null;

    const startTimeout = window.setTimeout(() => {
      const startTime = performance.now();

      const getFallDistance = () => {
        const rectContainerNow = container.getBoundingClientRect();
        const dotSize = ball.offsetWidth || 40;
        const smallNow = window.innerWidth <= BREAKPOINT_PX;

        const footerElement = document.getElementById("footer");
        const footerTop = footerElement
          ? footerElement.getBoundingClientRect().top - rectContainerNow.top
          : window.innerHeight - rectContainerNow.top - 100;

        const csMain = getComputedStyle(container);
        const padBottom = parseFloat(csMain.paddingBottom || "0") || 0;

        // ✅ Mobile: physisch im Main stoppen
        const mainBottom = container.clientHeight - (smallNow ? 2 : padBottom);
        const groundY = smallNow ? mainBottom : footerTop;

        return Math.max(0, groundY - startY - dotSize);
      };

      const phases = {
        fall: { end: 2000 },
        bounce: { end: 5200 },
        rollOut: { end: 5200 + 28000 },
      };

      const easeInQuad = (t: number) => t * t;
      const easeOutFriction = (t: number) => 1 - Math.pow(1 - t, 4);

      function animate(timestamp: number) {
        if (!wrapper) return;

        const elapsed = timestamp - startTime;
        const fallDistance = getFallDistance();
        const isMobileNow = window.innerWidth <= BREAKPOINT_PX;

        // ✅ Originalbahn (dein Verhalten)
        let x = I_EDGE_OFFSET;
        let y = startY;
        let rotation = 0;
        let scaleX = 1;
        let scaleY = 1;

        if (elapsed < phases.fall.end) {
          const t = elapsed / phases.fall.end;
          y = fallDistance * easeInQuad(t);
          rotation = t * 120;

          // ✅ Desktop: Zeitpunkt "kurz vor Aufkommen" merken (einmalig)
          if (!isMobileNow && t > 0.985 && impactAt === null) {
            impactAt = timestamp;
          }
        } else if (elapsed < phases.bounce.end) {
          const phaseTime = elapsed - phases.fall.end;
          const phaseDuration = phases.bounce.end - phases.fall.end;
          const t = phaseTime / phaseDuration;

          const numBounces = 5;
          const bounceProgress = t * numBounces;
          const currentBounce = Math.floor(bounceProgress);
          const bounceT = bounceProgress - currentBounce;

          const bounceStep = 70 + currentBounce * 10;
          let xOffset = 0;
          for (let i = 0; i < currentBounce; i++) {
            xOffset += 70 + i * 10;
          }

          x = I_EDGE_OFFSET + xOffset + bounceT * bounceStep;

          // ✅ Desktop bounct höher, Mobile bleibt wie gehabt
          let initialBounceHeight = isMobileNow ? 135 : 150;

          // die letzten Bounces etwas kleiner lassen (wie vorher), aber Desktop trotzdem etwas höher
          if (currentBounce >= numBounces - 2) {
            initialBounceHeight = isMobileNow ? 45 : 50;
          }

          const bounceHeight =
            initialBounceHeight * Math.pow(0.58, currentBounce);
          const bounceCurve = Math.sin(Math.PI * bounceT);

          y = fallDistance - bounceHeight * bounceCurve;

          // ✅ Squash/Stretch beim Kontakt (dein Original)
          if (bounceCurve < 0.15) {
            const squash = 1 - bounceCurve / 0.15;
            scaleX = 1 + squash * 0.12;
            scaleY = 1 - squash * 0.18;
          }

          // ✅ Desktop: zusätzlicher kurzer "Impact"-Impuls direkt nach dem ersten Aufkommen
          // (macht das Aufkommen "snappier", ähnlich wie auf Mobile)
          if (!isMobileNow && impactAt !== null) {
            const impactElapsed = timestamp - impactAt; // ms seit "impactAt"
            const impactDur = 140;

            if (impactElapsed < impactDur) {
              const p = impactElapsed / impactDur; // 0..1
              const kick = 1 - p; // schnell abklingend

              // mini-rebound + stärkerer squash
              y -= 10 * kick;
              scaleX += 0.18 * kick;
              scaleY -= 0.26 * kick;
            } else {
              impactAt = null;
            }
          }

          rotation += bounceT * 240;
        } else if (elapsed < phases.rollOut.end) {
          const phaseTime = elapsed - phases.bounce.end;
          const t = phaseTime / (phases.rollOut.end - phases.bounce.end);
          const easedT = easeOutFriction(t);

          let finalBounceX = I_EDGE_OFFSET;
          for (let i = 0; i < 5; i++) {
            finalBounceX += 70 + i * 10;
          }

          const totalDistance = window.innerWidth <= BREAKPOINT_PX ? 600 : 1500;

          x = finalBounceX + totalDistance * easedT;
          y = fallDistance;

          rotation += easedT * 700;
          wrapper.style.opacity = `${1 - Math.max(0, (t - 0.85) / 0.15)}`;
        } else {
          wrapper.style.display = "none";
          return;
        }

        wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        // ✅ Track-Offset bleibt wie bei dir
        const DESKTOP_TRACK_OFFSET = 16;
        const MOBILE_TRACK_OFFSET = 6;
        const trackOffset = isMobileNow
          ? MOBILE_TRACK_OFFSET
          : DESKTOP_TRACK_OFFSET;

        if (ball) {
          ball.style.transform = `translateX(${trackOffset}px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
        }

        rafId = requestAnimationFrame(animate);
      }

      rafId = requestAnimationFrame(animate);
    }, 9000);

    return () => {
      window.clearTimeout(startTimeout);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main ref={containerRef}>
      <div ref={wrapperRef} className="orange-dot-wrapper">
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
