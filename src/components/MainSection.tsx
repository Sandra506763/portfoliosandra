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

   
    const startX = rectI.left - rectContainer.left + rectI.width / 2 - 65;
    const startY = rectI.top - rectContainer.top - 20;
    
    // Startposition setzen
    wrapper.style.left = `${startX}px`;
    wrapper.style.top = `${startY}px`;
    wrapper.style.transform = `translate3d(0, 0, 0)`;

    let animationId: number;
    const containerHeight = container.offsetHeight;
    const containerWidth = container.offsetWidth;

    // Nach 8 Sekunden starten (5 + 3 = 8)
    const bounceTimeout = setTimeout(() => {
      const startTime = performance.now();
      const TOTAL_DURATION = 8000; // Doppelt so lange: 4000 * 2 = 8000ms
      
      // Treppenstufen definieren (wie ein Ball der Treppen runterfällt)
      const steps = [
        { x: 0, y: startY, bounceHeight: 0, duration: 0 }, // Start
        { x: 150, y: startY + 150, bounceHeight: 80, duration: 1000 }, // 1. Stufe (500 * 2)
        { x: 350, y: startY + 280, bounceHeight: 60, duration: 1800 }, // 2. Stufe (900 * 2)
        { x: 580, y: startY + 400, bounceHeight: 45, duration: 2600 }, // 3. Stufe (1300 * 2)
        { x: 820, y: startY + 500, bounceHeight: 30, duration: 3300 }, // 4. Stufe (1650 * 2)
        { x: 1050, y: startY + 580, bounceHeight: 18, duration: 3900 }, // 5. Stufe (1950 * 2)
        { x: 1260, y: startY + 640, bounceHeight: 10, duration: 4400 }, // 6. Stufe (2200 * 2)
        { x: 1450, y: startY + 680, bounceHeight: 5, duration: 4800 }, // 7. Stufe (2400 * 2)
        { x: containerWidth + 200, y: startY + 700, bounceHeight: 0, duration: 7000 } // Rausrollen (3500 * 2)
      ];

      function easeOutQuad(t: number): number {
        return t * (2 - t);
      }

      function easeInQuad(t: number): number {
        return t * t;
      }

      function animate(timestamp: number) {
        const elapsed = timestamp - startTime;
        
        if (elapsed >= TOTAL_DURATION) {
          // Animation beendet - ausblenden
          if (wrapper) {
            wrapper.style.display = 'none';
          }
          return;
        }

        // Finde aktuelle Stufe
        let currentStep = 0;
        for (let i = 0; i < steps.length - 1; i++) {
          if (elapsed >= steps[i].duration && elapsed < steps[i + 1].duration) {
            currentStep = i;
            break;
          }
        }

        const step = steps[currentStep];
        const nextStep = steps[currentStep + 1];
        
        if (!nextStep) {
          animationId = requestAnimationFrame(animate);
          return;
        }

        // Fortschritt zwischen zwei Stufen
        const stepDuration = nextStep.duration - step.duration;
        const stepElapsed = elapsed - step.duration;
        const t = Math.min(stepElapsed / stepDuration, 1);

        // Horizontale Bewegung (gleichmäßig)
        const x = step.x + (nextStep.x - step.x) * t;

        // Vertikale Bewegung mit Bounce
        let y: number;
        
        if (t < 0.5) {
          // Hochspringen (erste Hälfte)
          const bounceT = t * 2; // 0 bis 1
          const bounceAmount = step.bounceHeight * easeOutQuad(bounceT);
          y = step.y - bounceAmount + (nextStep.y - step.y) * easeInQuad(t);
        } else {
          // Runterfallen (zweite Hälfte)
          const fallT = (t - 0.5) * 2; // 0 bis 1
          const bounceAmount = step.bounceHeight * (1 - easeInQuad(fallT));
          y = step.y - bounceAmount + (nextStep.y - step.y) * t;
        }

        // Ausblenden am Ende (letzte 1000ms statt 500ms)
        const opacity = elapsed > 6000 ? 1 - (elapsed - 6000) / 1000 : 1;

        if (wrapper) {
          wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          wrapper.style.opacity = `${opacity}`;
        }

        animationId = requestAnimationFrame(animate);
      }

      animationId = requestAnimationFrame(animate);
    }, 8000); // 8 Sekunden warten (5 + 3)

    return () => {
      clearTimeout(bounceTimeout);
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