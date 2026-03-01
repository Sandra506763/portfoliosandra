import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import type { CharItem } from "../types";

const RightHeader: React.FC = () => {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const showStatement = location.pathname === "/about" || location.pathname === "/projects";

  const [chars, setChars] = useState<CharItem[]>([]);

  useEffect(() => {
    const text = "Sandra Nitsch";
    setChars(
      [...text].map((ch, i) => ({
        char: ch,
        delay: i * 0.15,
      }))
    );
  }, []);


  useEffect(() => {
    if (!isHome) return;

    const h1 = h1Ref.current;
    if (!h1) return;

    const spans = h1.querySelectorAll("span");
    const handlers: Array<{ span: Element; handler: () => void }> = [];

    spans.forEach((span, i) => {
      if (chars[i]?.char === " ") return;

      const handleAnimationStart = () => {
        const bubble = document.createElement("span");
        bubble.className = "bubble";

        const size = Math.random() * 10 + 6;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        const el = span as HTMLElement;
        bubble.style.left = `${el.offsetLeft + el.offsetWidth / 2 - size / 2}px`;
        bubble.style.animationDuration = `${2 + Math.random()}s`;

        h1.appendChild(bubble);
        window.setTimeout(() => bubble.remove(), 3000);
      };

      span.addEventListener("animationstart", handleAnimationStart);
      handlers.push({ span, handler: handleAnimationStart });
    });

    return () => {
      handlers.forEach(({ span, handler }) => {
        span.removeEventListener("animationstart", handler);
      });
    };
  }, [chars, isHome]);

  const titleContent = useMemo(() => {
    return chars.map((item, i) => {
      if (item.char === " ") {
        return (
          <span
            key={i}
            className="nameSpace"
            style={isHome ? { animationDelay: `${item.delay}s` } : undefined}
            dangerouslySetInnerHTML={{ __html: "&nbsp;" }}
          />
        );
      }

      return (
        <span
          key={i}
          className="nameChar"
          style={isHome ? { animationDelay: `${item.delay}s` } : undefined}
        >
          {item.char}
        </span>
      );
    });
  }, [chars, isHome]);

  return (
    <div className={`sideStack ${isHome ? "rh-home" : "rh-static"}`}>
      <div className="profileBox">
        <img src="/images/pictureMe.jpg" alt="Profilbild" className="profile-pic" />
      </div>

      <div className="homeHeader">
        <h1
          ref={h1Ref}
          id="fancy-heading"
          className="homeTitle"
          aria-label="Sandra Nitsch"
        >
          {titleContent}
        </h1>

     
        <p className="web rh-role">Webentwicklerin</p>
      </div>

      <Navigation />

      {showStatement && <div className="side-statement">Design is how it feels</div>}
    </div>
  );
};

export default RightHeader;