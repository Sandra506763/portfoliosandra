import React, { useEffect, useRef } from "react";

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

    const I_EDGE_OFFSET = 33;

    const startX = rectI.left - rectContainer.left + rectI.width / 2 - 65;
    const startY = rectI.top - rectContainer.top - 20;

    wrapper.style.left = `${startX}px`;
    wrapper.style.top = `${startY}px`;
    wrapper.style.transform = "translate3d(0,0,0)";
    wrapper.style.display = "block";
    wrapper.style.zIndex = "10";

    const startTimeout = setTimeout(() => {
      let animationId: number;
      const startTime = performance.now();

      const footerElement = document.getElementById("footer");
      const footerTop = footerElement
        ? footerElement.getBoundingClientRect().top - rectContainer.top
        : window.innerHeight - 100;

      // Phasen-Dauer
      const phases = {
        fall: { end: 2000 },
        bounce: { end: 5200 },
        rollOut: { end: 5200 + 18000 }, // Rollout jetzt 18 Sekunden für sanftes Bremsen
      };

      const easeInQuad = (t: number) => t * t;
      const easeOutQuad = (t: number) => t * (2 - t);

      // ✅ neue Ease-out für horizontales Rollen
      const easeOutSlow = (t: number) => 1 - Math.pow(1 - t, 2.5);

      function animate(timestamp: number) {
        if (!wrapper) return;

        const elapsed = timestamp - startTime;
        let x = I_EDGE_OFFSET;
        let y = startY;
        let rotation = 0;
        let scaleX = 1;
        let scaleY = 1;

        /* ===== FALL AM I ===== */
        if (elapsed < phases.fall.end) {
          const t = elapsed / phases.fall.end;
          const fallDistance = footerTop - startY - 40;
          y = fallDistance * easeInQuad(t);
          rotation = t * 120;
        } else if (elapsed < phases.bounce.end) {

        /* ===== BOUNCES ===== */
          const phaseTime = elapsed - phases.fall.end;
          const phaseDuration = phases.bounce.end - phases.fall.end;
          const t = phaseTime / phaseDuration;

          const numBounces = 5;
          const bounceProgress = t * numBounces;
          const currentBounce = Math.floor(bounceProgress);
          const bounceT = bounceProgress - currentBounce;

          const bounceStep = 70;
          x = I_EDGE_OFFSET + currentBounce * bounceStep + bounceT * bounceStep;

          const initialBounceHeight = 100;
          const bounceHeight =
            initialBounceHeight * Math.pow(0.65, currentBounce);
          const bounceCurve = Math.sin(Math.PI * bounceT);

          y = footerTop - startY - 40 - bounceHeight * bounceCurve;

          if (bounceCurve < 0.15) {
            const squash = 1 - bounceCurve / 0.15;
            scaleX = 1 + squash * 0.12;
            scaleY = 1 - squash * 0.18;
          }

          rotation += bounceT * 240;
        } else if (elapsed < phases.rollOut.end) {

        /* ===== AUSROLLEN (langsamer, decelerated) ===== */
          const phaseTime = elapsed - phases.bounce.end;
          const t = phaseTime / (phases.rollOut.end - phases.bounce.end);

          // sanftes Abbremsen
          const easedT = easeOutSlow(t);

          const totalDistance = 1500;
          x = I_EDGE_OFFSET + 5 * 70 + totalDistance * easedT;
          y = footerTop - startY - 40;

          rotation += easedT * 900;

          wrapper.style.opacity = `${1 - Math.max(0, (t - 0.85) / 0.15)}`;
        } else {
          wrapper.style.display = "none";
          return;
        }

        wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        const ball = wrapper.querySelector(".orange-dot") as HTMLElement;
        if (ball) {
          ball.style.transform = `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
        }

        animationId = requestAnimationFrame(animate);
      }

      animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }, 9000);

    return () => clearTimeout(startTimeout);
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
        NG'S IMPOS-SIBLE
      </p>
    </main>
  );
};

export default MainSection;
