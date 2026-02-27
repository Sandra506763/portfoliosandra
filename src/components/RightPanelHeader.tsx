import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import type { CharItem } from "../types";
import "../styles/RightPanelHeader.css";

type Props = {
  bubbles?: boolean;     // Home
  statement?: boolean;   // About/Projects
  roleText?: string;
  imageSrc?: string;
};

const BREAKPOINT_PX = 768;

const RightPanelHeader: React.FC<Props> = ({
  bubbles = false,
  statement = false,
  roleText = "Webentwicklerin",
  imageSrc = "/images/pictureMe.jpg",
}) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const rootRef = useRef<HTMLDivElement | null>(null);
  const bubbleLayerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const sliderNavRef = useRef<HTMLDivElement | null>(null);

  const [chars, setChars] = useState<CharItem[]>([]);

  useEffect(() => {
    const text = "Sandra Nitsch";
    setChars(
      [...text].map((ch, i) => ({
        char: ch,
        delay: i * 0.22, // wie dein Home vorher
      }))
    );
  }, []);

  // Title-Rendering: Home mit Delay, sonst ohne Delay
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

  // ✅ Slider-Bubbles (wie früher in Home.tsx): starten AUS dem Slider
  useEffect(() => {
    if (!bubbles || !isHome) return;

    const layer = bubbleLayerRef.current;
    const titleEl = titleRef.current;
    const sliderEl = sliderNavRef.current;

    if (!layer || !titleEl || !sliderEl) return;

    let intervalId: number | null = null;
    let stopTimeoutId: number | null = null;
    let started = false;

    const spawnBubble = () => {
      const l = bubbleLayerRef.current;
      const slider = sliderNavRef.current;
      if (!l || !slider) return;

      const layerRect = l.getBoundingClientRect();
      const sliderRect = slider.getBoundingClientRect();

      // Slider-Koordinaten relativ zum Bubble-Layer
      const sliderLeft = sliderRect.left - layerRect.left;
      const sliderRight = sliderRect.right - layerRect.left;

      const bubble = document.createElement("span");
      bubble.className = "rph-bubble";

      const size = Math.floor(Math.random() * 10) + 10; // 10..19
      const radius = size / 2;

      const duration = Math.random() * 1.4 + 3.0;
      const opacity = Math.random() * 0.25 + 0.18;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.opacity = `${opacity}`;
      bubble.style.animationDuration = `${duration}s`;

      // Mittelpunkt vom Slider
      const centerX = sliderLeft + (sliderRight - sliderLeft) / 2;

      // Mobile: kleinere Streuung, Desktop: wie gehabt
      const isMobile = window.innerWidth <= BREAKPOINT_PX;
      const spread = isMobile
        ? (sliderRight - sliderLeft) * 0.35
        : Math.max(40, (sliderRight - sliderLeft) * 0.55);

      let xCenter = centerX + (Math.random() * spread - spread / 2);

      // Hard clamp, Bubble bleibt IM Slider
      const padding = 6;
      const minCenter = sliderLeft + padding + radius;
      const maxCenter = sliderRight - padding - radius;

      if (maxCenter <= minCenter) xCenter = centerX;
      else xCenter = Math.max(minCenter, Math.min(maxCenter, xCenter));

      bubble.style.left = `${xCenter - radius}px`;

      // Start hinter/unter dem Slider
      const bottomFromLayer = layerRect.bottom - sliderRect.bottom + 6;
      bubble.style.bottom = `${Math.max(6, bottomFromLayer)}px`;

      l.appendChild(bubble);
      bubble.addEventListener("animationend", () => bubble.remove());
    };

    const stopBubbles = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      if (stopTimeoutId) {
        window.clearTimeout(stopTimeoutId);
        stopTimeoutId = null;
      }
    };

    const firstChar = titleEl.querySelector(".nameChar") as HTMLElement | null;

    const onStart = () => {
      if (started) return;
      started = true;

      intervalId = window.setInterval(spawnBubble, 350);

      // wie vorher in Home: Name-Animzeit + Buffer
      const totalNameTime = (chars.length - 1) * 220 + 900;
      stopTimeoutId = window.setTimeout(stopBubbles, totalNameTime + 3000);
    };

    if (firstChar) firstChar.addEventListener("animationstart", onStart, { once: true });
    else onStart();

    return () => {
      if (firstChar) firstChar.removeEventListener("animationstart", onStart);
      stopBubbles();
      layer.querySelectorAll(".rph-bubble").forEach((b) => b.remove());
    };
  }, [bubbles, isHome, chars.length]);

  return (
    <div ref={rootRef} className={`rph ${isHome ? "rph-home" : "rph-static"}`}>
      {/* ✅ Layer sitzt hinter allem und ist für Slider-Bubbles */}
      {bubbles && isHome && (
        <div ref={bubbleLayerRef} className="rph-bubbleLayer" aria-hidden="true" />
      )}

      <div className="rph-sideStack">
        <div className="rph-profileBox">
          {/* wenn du “profile-pic” wirklich im DOM behalten willst: className="profile-pic rph-profilePic" */}
          <img src={imageSrc} alt="Profilbild" className="rph-profilePic" loading="lazy" />
        </div>

        <header className="rph-homeHeader">
          <h1 ref={titleRef} className="rph-homeTitle" aria-label="Sandra Nitsch">
            {titleContent}
          </h1>

          <p className="rph-homeSub">
            <span className="rph-web">{roleText}</span>
          </p>
        </header>

        {/* ✅ Navigation bekommt ref, damit Bubbles den Slider messen können */}
        <div ref={sliderNavRef} className="rph-sliderWrap">
  <Navigation />
</div>
          
      
        {statement && <div className="rph-statement">Design is how it feels</div>}
      </div>
    </div>
  );
};

export default RightPanelHeader;