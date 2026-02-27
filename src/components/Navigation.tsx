import React, { useEffect, useMemo, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navigation: React.FC = () => {
  const { pathname } = useLocation();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  // 0/1/2 je nach Route
  const activeIndex = useMemo(() => {
    if (pathname === "/") return 0;
    if (pathname.startsWith("/about")) return 1;
    if (pathname.startsWith("/projects")) return 2;
    return 0;
  }, [pathname]);

  // Setzt die Bubble-Position (ohne Layout zu ändern)
  const setHighlight = (index: number) => {
    const h = highlightRef.current;
    if (!h) return;

    // Dein CSS nutzt translateX(0/100/200) bereits – wir setzen exakt das
    const nudge = index === 0 ? 7 : 0; // px nach rechts nur für HOME
    h.style.transform = `translateX(calc(${index * 100}% + ${nudge}px)) scale(0.85)`;
  };

  // Beim Seitenwechsel Bubble korrekt setzen
  useEffect(() => {
    setHighlight(activeIndex);
  }, [activeIndex]);

  // Wenn Maus den Slider verlässt, wieder zur aktiven Seite zurück
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onLeave = () => setHighlight(activeIndex);
    slider.addEventListener("mouseleave", onLeave);

    return () => {
      slider.removeEventListener("mouseleave", onLeave);
    };
  }, [activeIndex]);

  return (
    <nav className="slider-nav">
      <div ref={sliderRef} className="slider">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
          onMouseEnter={() => setHighlight(0)}
          onFocus={() => setHighlight(0)}
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
          onMouseEnter={() => setHighlight(1)}
          onFocus={() => setHighlight(1)}
        >
          Über<br />
          mich
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? "active" : "")}
          onMouseEnter={() => setHighlight(2)}
          onFocus={() => setHighlight(2)}
        >
          Projekte
        </NavLink>

        {/* Bubble */}
        <span ref={highlightRef} className="highlight" aria-hidden="true" />
      </div>
    </nav>
  );
};

export default Navigation;