import React, { useEffect, useMemo, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navigation: React.FC = () => {
  const { pathname } = useLocation();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  const activeIndex = useMemo(() => {
    if (pathname === "/") return 0;
    if (pathname.startsWith("/about")) return 1;
    if (pathname.startsWith("/projects")) return 2;
    return 0;
  }, [pathname]);

  const setHighlight = (index: number) => {
    const h = highlightRef.current;
    if (!h) return;

    let nudge = 0;

    if (index === 0) nudge = 6;     
    if (index === 1) nudge = -2;    
    if (index === 2) nudge = -4;    
    
    h.style.transform = `translateX(calc(${index * 100}% + ${nudge}px)) scale(0.85)`;
  };


  useEffect(() => {
    setHighlight(activeIndex);
  }, [activeIndex]);

  
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

    
        <span ref={highlightRef} className="highlight" aria-hidden="true" />
      </div>
    </nav>
  );
};

export default Navigation;