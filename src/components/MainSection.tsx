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

    // Position des "I" berechnen
    const rectI = iLetter.getBoundingClientRect();
    const rectContainer = container.getBoundingClientRect();

    // Punkt startet rechts vom I
    const startX = rectI.left - rectContainer.left + rectI.width / 2 - 65;
    const startY = rectI.top - rectContainer.top - 20;

    // Startposition setzen - Ball ist von Anfang an sichtbar
    wrapper.style.left = `${startX}px`;
    wrapper.style.top = `${startY}px`;
    wrapper.style.transform = `translate3d(0, 0, 0)`;
    wrapper.style.display = "block";
    wrapper.style.zIndex = "10";

    // Warte 9 Sekunden bevor Animation startet
    const startTimeout = setTimeout(() => {
      let animationId: number;
      const startTime = performance.now();

      // Physik-Konstanten für realistisches Ballverhalten
      const BOUNCE_DAMPING = 0.65; // Energieverlust beim Bounce (65% bleiben)

      // Wichtige Y-Positionen der Buchstaben (relativ zum Container)
      const letterI_bottom = rectI.bottom - rectContainer.top;
      const letterP_top = letterI_bottom + 80; // "P" beginnt etwas tiefer
      const letterL_top = letterP_top + 200; // "L" noch tiefer

      // Footer Position
      const footerElement = document.getElementById("footer");
      const footerTop = footerElement
        ? footerElement.getBoundingClientRect().top - rectContainer.top
        : window.innerHeight - 100;

      // Animation Phasen
      const phases = {
        // Phase 1: Schneller am I herunter rollen (2.5 Sekunden statt 4)
        rollDownI: { start: 0, end: 2500 },
        // Phase 2: Auf P aufkommen und direkt im Bogen zu L (2 Sekunden)
        bounceToL: { start: 2500, end: 4500 },
        // Phase 3: Mehrere Bounces auf Footer (3 Sekunden)
        bounceOnFooter: { start: 4500, end: 7500 },
        // Phase 4: Ausrollen (8 Sekunden - langsamer)
        rollOut: { start: 7500, end: 15500 },
      };

      function easeInQuad(t: number): number {
        return t * t;
      }

      function easeOutQuad(t: number): number {
        return t * (2 - t);
      }

      function animate(timestamp: number) {
        if (!wrapper) return;

        const elapsed = timestamp - startTime;
        let x = 0;
        let y = 0;
        let rotation = 0;

        // Phase 1: Schneller am I herunter rollen
        if (elapsed < phases.rollDownI.end) {
          const t = elapsed / phases.rollDownI.end;
          const rollDistance = letterI_bottom - startY;
          y = rollDistance * easeInQuad(t);
          x = 32; // Bleibt rechts am I
          rotation = t * 180;
        }
        // Phase 2: Von I-Ende über P direkt im Bogen zu L
        else if (elapsed < phases.bounceToL.end) {
          const phaseTime = elapsed - phases.rollDownI.end;
          const phaseDuration = phases.bounceToL.end - phases.rollDownI.end;
          const t = phaseTime / phaseDuration;

          // Horizontale Bewegung von I zu L
          x = 32 + 218 * t;

          // Bogen: runter auf P, hoch im Bogen, runter auf L
          const startHeight = letterI_bottom - startY;
          const pHeight = letterP_top - startY;
          const endHeight = letterL_top - startY;

          if (t < 0.25) {
            // Runter auf P (erste 25%)
            const fallT = t / 0.25;
            y = startHeight + (pHeight - startHeight) * easeInQuad(fallT);
          } else if (t < 0.6) {
            // Bogen hoch von P (25%-60%)
            const bounceT = (t - 0.25) / 0.35;
            const arcHeight = pHeight - 100; // Höhepunkt des Bogens
            y = pHeight - (pHeight - arcHeight) * easeOutQuad(bounceT);
          } else {
            // Bogen runter auf L (60%-100%)
            const fallT = (t - 0.6) / 0.4;
            const arcHeight = pHeight - 100;
            y = arcHeight + (endHeight - arcHeight) * easeInQuad(fallT);
          }

          rotation = 180 + t * 540;
        }
        // Phase 3: Mehrere abnehmende Bounces auf Footer (weit auseinandergezogen)
        else if (elapsed < phases.bounceOnFooter.end) {
          const phaseTime = elapsed - phases.bounceToL.end;
          const phaseDuration =
            phases.bounceOnFooter.end - phases.bounceToL.end;
          const t = phaseTime / phaseDuration;

          // 5 Bounces mit abnehmender Höhe
          const numBounces = 5;
          const bounceProgress = t * numBounces;
          const currentBounce = Math.floor(bounceProgress);
          const bounceT = bounceProgress - currentBounce;

          // Jeder Bounce 100px weiter nach rechts
          x = 250 + currentBounce * 100 + bounceT * 100;

          // Erste Bounce-Höhe: 100px, dann jedes Mal 65% weniger
          const initialBounceHeight = 100;
          const currentBounceHeight =
            initialBounceHeight * Math.pow(BOUNCE_DAMPING, currentBounce);

          if (bounceT < 0.5) {
            // Fallen
            const fallT = bounceT * 2;
            y =
              footerTop -
              startY -
              40 -
              currentBounceHeight * (1 - easeInQuad(fallT));
          } else {
            // Hochspringen
            const riseT = (bounceT - 0.5) * 2;
            y =
              footerTop -
              startY -
              40 -
              currentBounceHeight * easeOutQuad(1 - riseT);
          }

          rotation = 720 + t * 900;
        }
        // Phase 4: Langsam ausrollen nach rechts
        else if (elapsed < phases.rollOut.end) {
          const phaseTime = elapsed - phases.bounceOnFooter.end;
          const phaseDuration = phases.rollOut.end - phases.bounceOnFooter.end;
          const t = phaseTime / phaseDuration;

          // Langsamer rollen (1400px über 8 Sekunden)
          x = 750 + 1400 * t;
          y = footerTop - startY - 40;
          rotation = 1620 + t * 800;

          // Ausblenden am Ende
          const opacity = 1 - Math.max(0, (t - 0.85) / 0.15);
          wrapper.style.opacity = `${opacity}`;
        } else {
          // Animation beendet
          wrapper.style.display = "none";
          return;
        }

        // Position und Rotation anwenden
        wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        // Rotation auf den Ball anwenden
        const ball = wrapper.querySelector(".orange-dot") as HTMLElement;
        if (ball) {
          ball.style.transform = `rotate(${rotation}deg)`;
        }

        animationId = requestAnimationFrame(animate);
      }

      animationId = requestAnimationFrame(animate);

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
      };
    }, 9000);

    return () => {
      clearTimeout(startTimeout);
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
