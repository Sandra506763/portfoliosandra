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

    const startX =
      rectI.left - rectContainer.left + rectI.width / 2 - 65;
    const startY =
      rectI.top - rectContainer.top - 20;

    wrapper.style.left = `${startX}px`;
    wrapper.style.top = `${startY}px`;
    wrapper.style.transform = "translate3d(0,0,0)";
    wrapper.style.display = "block";
    wrapper.style.zIndex = "10";

    const startTimeout = setTimeout(() => {
      let animationId: number;
      const startTime = performance.now();

      const BOUNCE_DAMPING = 0.65;

      const footerElement = document.getElementById("footer");
      const footerTop = footerElement
        ? footerElement.getBoundingClientRect().top - rectContainer.top
        : window.innerHeight - 100;

      const phases = {
        fallToFooter: { start: 0, end: 2000 },
        bounceOnFooter: { start: 2000, end: 5000 },
        rollOut: { start: 5000, end: 9000 },
      };

      const easeInQuad = (t: number) => t * t;
      const easeOutQuad = (t: number) => t * (2 - t);

      // ✅ NEU: kleiner Versatz, damit er AM I rollt
      const I_EDGE_OFFSET = 33;

      function animate(timestamp: number) {
        if (!wrapper) return;

        const elapsed = timestamp - startTime;
        let x = 0;
        let y = 0;
        let rotation = 0;

        // Phase 1: Am I entlang rollen und fallen
        if (elapsed < phases.fallToFooter.end) {
          const t = elapsed / phases.fallToFooter.end;
          const fallDistance = footerTop - startY - 40;

          x = I_EDGE_OFFSET; // 🔑 HIER: nicht im I, sondern am I
          y = fallDistance * easeInQuad(t);
          rotation = t * 120;
        }

        // Phase 2: Bounces auf Footer
        else if (elapsed < phases.bounceOnFooter.end) {
          const phaseTime =
            elapsed - phases.fallToFooter.end;
          const phaseDuration =
            phases.bounceOnFooter.end - phases.fallToFooter.end;
          const t = phaseTime / phaseDuration;

          const numBounces = 5;
          const bounceProgress = t * numBounces;
          const currentBounce = Math.floor(bounceProgress);
          const bounceT = bounceProgress - currentBounce;

          const bounceStep = 70;
          x = I_EDGE_OFFSET + currentBounce * bounceStep + bounceT * bounceStep;

          const initialBounceHeight = 100;
          const bounceHeight =
            initialBounceHeight *
            Math.pow(BOUNCE_DAMPING, currentBounce);

          if (bounceT < 0.5) {
            const fallT = bounceT * 2;
            y =
              footerTop -
              startY -
              40 -
              bounceHeight * (1 - easeInQuad(fallT));
          } else {
            const riseT = (bounceT - 0.5) * 2;
            y =
              footerTop -
              startY -
              40 -
              bounceHeight * easeOutQuad(1 - riseT);
          }

          rotation = 600 + t * 900;
        }

        // Phase 3: Ausrollen (weiter!)
        else if (elapsed < phases.rollOut.end) {
          const phaseTime =
            elapsed - phases.bounceOnFooter.end;
          const phaseDuration =
            phases.rollOut.end - phases.bounceOnFooter.end;
          const t = phaseTime / phaseDuration;

          const rollOutDistance = 1100; // 🔑 länger ausrollen
          x = I_EDGE_OFFSET + 5 * 70 + rollOutDistance * t;
          y = footerTop - startY - 40;
          rotation = 1500 + t * 800;

          wrapper.style.opacity = `${1 - Math.max(0, (t - 0.85) / 0.15)}`;
        } else {
          wrapper.style.display = "none";
          return;
        }

        wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        const ball = wrapper.querySelector(".orange-dot") as HTMLElement;
        if (ball) {
          ball.style.transform = `rotate(${rotation}deg)`;
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
        <span ref={iLetterRef} className="i-letter">I</span>
        NG'S IMPOS-SIBLE
      </p>
    </main>
  );
};

export default MainSection;
