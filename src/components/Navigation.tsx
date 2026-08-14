import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
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
    const slider = sliderRef.current;
    const h = highlightRef.current;

    if (!slider || !h) return;

    const links = slider.querySelectorAll("a");
    const link = links[index] as HTMLElement | undefined;

    if (!link) return;

    const sliderRect = slider.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    const linkCenter = linkRect.left - sliderRect.left + linkRect.width / 2;

    const highlightWidth = h.offsetWidth;

    h.style.left = `${linkCenter - highlightWidth / 2}px`;
    h.style.transform = "scale(0.85)";
  };

  useLayoutEffect(() => {
    setHighlight(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onLeave = () => setHighlight(activeIndex);
    slider.addEventListener("mouseleave", onLeave);

    return () => slider.removeEventListener("mouseleave", onLeave);
  }, [activeIndex]);

  return (
    <nav className="slider-nav">
      <div ref={sliderRef} className="slider">
        <NavLink
          to="/"
          end
          translate="no"
          className={({ isActive }) =>
            isActive ? "active notranslate" : "notranslate"
          }
          onMouseEnter={() => setHighlight(0)}
          onFocus={() => setHighlight(0)}
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          translate="no"
          className={({ isActive }) =>
            isActive ? "active notranslate" : "notranslate"
          }
          onMouseEnter={() => setHighlight(1)}
          onFocus={() => setHighlight(1)}
        >
          Über
          <br />
          mich
        </NavLink>

        <NavLink
          to="/projects"
          translate="no"
          className={({ isActive }) =>
            isActive ? "active notranslate" : "notranslate"
          }
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
