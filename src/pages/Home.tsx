// Home.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Portfolio.css";

const BREAKPOINT_PX = 768;

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const iLetterRef = useRef<HTMLSpanElement | null>(null);

  const bubbleLayerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const sliderNavRef = useRef<HTMLElement | null>(null);

  const nameText = "Sandra Nitsch";
  const nameChars = useMemo(
    () => [...nameText].map((ch, i) => ({ ch, delay: i * 0.22 })),
    [nameText]
  );

  // =========================
  // BUBBLES
  // =========================
  useEffect(() => {
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

      const centerX = sliderRect.left - layerRect.left + sliderRect.width / 2;
      const spread = Math.max(40, sliderRect.width * 0.55);
      const x = centerX + (Math.random() * spread - spread / 2);

      const bubble = document.createElement("span");
      bubble.className = "bubble";

      const size = Math.floor(Math.random() * 10) + 10;
      const duration = Math.random() * 1.4 + 3.0;
      const opacity = Math.random() * 0.25 + 0.18;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${x}px`;
      bubble.style.opacity = `${opacity}`;
      bubble.style.animationDuration = `${duration}s`;

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

      const totalNameTime = (nameChars.length - 1) * 220 + 900;
      stopTimeoutId = window.setTimeout(stopBubbles, totalNameTime + 3000);
    };

    if (firstChar) firstChar.addEventListener("animationstart", onStart, { once: true });
    else onStart();

    return () => {
      if (firstChar) firstChar.removeEventListener("animationstart", onStart);
      stopBubbles();
      layer.querySelectorAll(".bubble").forEach((b) => b.remove());
    };
  }, [nameChars]);

  // =========================
  // BALL (QuoteCard)
  // =========================
  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const iLetter = iLetterRef.current;

    if (!container || !wrapper || !iLetter) return;

    const ball = wrapper.querySelector(".orange-dot") as HTMLElement | null;
    if (!ball) return;

    let rafId: number | null = null;
    let startTimeoutId: number | null = null;
    let isRunning = false;

    const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
    const easeInQuad = (t: number) => t * t;
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const placeOnI = () => {
      const rectI = iLetter.getBoundingClientRect();
      const rectC = container.getBoundingClientRect();

      const isMobile = window.innerWidth <= BREAKPOINT_PX;
      const dotSize = ball.offsetWidth || 40;

      const xCenter = rectI.left - rectC.left + rectI.width / 2;
      const yTopLine = rectI.top - rectC.top - (isMobile ? 10 : 18);

      const X_NUDGE = -3;
      const Y_NUDGE = -8;

      wrapper.style.left = `${xCenter - dotSize / 2 + X_NUDGE}px`;
      wrapper.style.top = `${yTopLine + Y_NUDGE}px`;
      wrapper.style.transform = "translate3d(0,0,0)";
      wrapper.style.display = "block";
      wrapper.style.opacity = "1";
      wrapper.style.zIndex = "10";

      ball.style.transform = "translateX(0px) rotate(0deg) scale(1,1)";
    };

    const getGroundDY = (startTop: number) => {
      const cs = getComputedStyle(container);
      const padBottom = parseFloat(cs.paddingBottom || "0") || 0;
      const dotSize = ball.offsetWidth || 40;

      const GROUND_EXTRA = 33;

      const groundY = container.clientHeight - padBottom - dotSize + GROUND_EXTRA;
      return Math.max(0, groundY - startTop);
    };

    placeOnI();

    const onResize = () => {
      if (!isRunning) placeOnI();
    };
    window.addEventListener("resize", onResize);

    const phases = {
      pulse: 2600,
      // ✅ noch schneller insgesamt
      rollAndDrop: 2050, // vorher 2400
      bounce: 2900,
      rollOut: 12000,
    };

    startTimeoutId = window.setTimeout(() => {
      isRunning = true;

      const startTop = parseFloat(wrapper.style.top || "0") || 0;
      const groundDY = getGroundDY(startTop);

      const startTime = performance.now();
      const isMobile = window.innerWidth <= BREAKPOINT_PX;

      // ✅ noch ein Hauch mehr rechts am I entlang
      const rollDX = isMobile ? 32 : 46; // vorher 30/43

      // ✅ noch früher fallen = schneller runter
      const dropStart = 0.22; // vorher 0.28

      const bounces = 5;
      const bounceStepX = isMobile ? 48 : 70;

      const animate = (now: number) => {
        const tAll = now - startTime;

        let dx = 0;
        let dy = 0;
        let rotation = 0;
        let scaleX = 1;
        let scaleY = 1;

        // 1) Pulse
        if (tAll < phases.pulse) {
          const t = tAll / phases.pulse;
          const wobble = Math.sin(t * Math.PI * 2) * 0.04;
          scaleX = 1 + wobble;
          scaleY = 1 - wobble;

          wrapper.style.transform = `translate3d(0px, 0px, 0)`;
          ball.style.transform = `translateX(0px) rotate(0deg) scale(${scaleX}, ${scaleY})`;

          rafId = requestAnimationFrame(animate);
          return;
        }

        // 2) Roll + Drop (ultra schnell & flüssig)
        const t2 = tAll - phases.pulse;
        if (t2 < phases.rollAndDrop) {
          const t = clamp01(t2 / phases.rollAndDrop);

          // X: super schnell (steiler als easeOutQuad)
          const tx = Math.min(1, Math.pow(easeOutQuad(t), 0.55));
          dx = rollDX * tx;

          // Y: startet sehr früh & fällt schneller (steiler)
          if (t <= dropStart) {
            dy = 0;
          } else {
            const ty = clamp01((t - dropStart) / (1 - dropStart));
            const fall = Math.min(1, Math.pow(easeInQuad(ty), 0.62)); // ✅ schneller
            dy = groundDY * fall;
          }

          rotation = tx * 1120;

          if (t > 0.92) {
            const p = (t - 0.92) / 0.08;
            scaleX = 1 + 0.18 * p;
            scaleY = 1 - 0.26 * p;
          }

          wrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          ball.style.transform = `translateX(0px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;

          rafId = requestAnimationFrame(animate);
          return;
        }

        // 3) Bounce
        const t3 = t2 - phases.rollAndDrop;
        if (t3 < phases.bounce) {
          const t = clamp01(t3 / phases.bounce);

          const prog = t * bounces;
          const idx = Math.floor(prog);
          const localT = prog - idx;

          let bounceDX = rollDX;
          for (let i = 0; i < idx; i++) bounceDX += bounceStepX + i * 10;
          bounceDX += (bounceStepX + idx * 10) * localT;

          const baseY = groundDY;
          const initialH = isMobile ? 120 : 150;
          const h = initialH * Math.pow(0.58, idx);
          const curve = Math.sin(Math.PI * localT);

          dx = bounceDX;
          dy = baseY - h * curve;
          rotation = 1120 + (idx + localT) * 220;

          if (curve < 0.12) {
            const p = 1 - curve / 0.12;
            scaleX = 1 + 0.12 * p;
            scaleY = 1 - 0.18 * p;
          }

          wrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          ball.style.transform = `translateX(0px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;

          rafId = requestAnimationFrame(animate);
          return;
        }

        // 4) Roll out
        const t4 = t3 - phases.bounce;
        if (t4 < phases.rollOut) {
          const t = clamp01(t4 / phases.rollOut);
          const eased = easeOutQuad(t);

          let endBounceDX = rollDX;
          for (let i = 0; i < bounces; i++) endBounceDX += bounceStepX + i * 10;

          const totalOut = isMobile ? 700 : 1600;

          dx = endBounceDX + totalOut * eased;
          dy = groundDY;
          rotation = 1500 + eased * 1400;

          wrapper.style.opacity = `${1 - Math.max(0, (t - 0.88) / 0.12)}`;
          wrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          ball.style.transform = `translateX(0px) rotate(${rotation}deg) scale(1,1)`;

          rafId = requestAnimationFrame(animate);
          return;
        }

        wrapper.style.display = "none";
        isRunning = false;
      };

      rafId = requestAnimationFrame(animate);
    }, 9000);

    return () => {
      window.removeEventListener("resize", onResize);
      if (startTimeoutId) window.clearTimeout(startTimeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="homePage">
      <section className="homeFrame">
        <section className="homeGrid">
          <div className="homeLeft">
            <div ref={containerRef} className="quoteCard homeBallStage">
              <div
                ref={wrapperRef}
                className="orange-dot-wrapper"
                style={{ display: "none" }}
                aria-hidden="true"
              >
                <div className="orange-dot" />
              </div>

              <div className="quoteLines" aria-hidden="true">
                <div className="qLine">
                  <span className="qChar">N</span>
                  <span className="qChar">O</span>
                  <span className="qChar">-</span>
                </div>

                <div className="qLine">
                  <span className="qChar">T</span>
                  <span className="qChar">H</span>
                  <span ref={iLetterRef} className="qChar qI">
                    I
                  </span>
                  <span className="qChar">N</span>
                  <span className="qChar">G</span>
                  <span className="qChar">&apos;</span>
                  <span className="qChar">S</span>
                </div>

                <div className="qLine">
                  <span className="qChar">I</span>
                  <span className="qChar">M</span>
                  <span className="qChar">P</span>
                  <span className="qChar">O</span>
                  <span className="qChar">S</span>
                  <span className="qChar">-</span>
                </div>

                <div className="qLine">
                  <span className="qChar">S</span>
                  <span className="qChar">I</span>
                  <span className="qChar">B</span>
                  <span className="qChar">L</span>
                  <span className="qChar">E</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="homeRight" aria-label="Profil und Navigation">
            <div ref={bubbleLayerRef} className="bubbleLayer" aria-hidden="true" />

            <div className="sideStack">
              <div className="profileBox">
                <img
                  className="profile-pic"
                  src="/images/pictureMe.jpg"
                  alt="Profilbild"
                  loading="lazy"
                />
              </div>

              <header className="homeHeader">
                <h1 ref={titleRef} className="homeTitle" aria-label={nameText}>
                  {nameChars.map((item, i) =>
                    item.ch === " " ? (
                      <span
                        key={i}
                        className="nameSpace"
                        style={{ animationDelay: `${item.delay}s` }}
                        dangerouslySetInnerHTML={{ __html: "&nbsp;" }}
                      />
                    ) : (
                      <span
                        key={i}
                        className="nameChar"
                        style={{ animationDelay: `${item.delay}s` }}
                      >
                        {item.ch}
                      </span>
                    )
                  )}
                </h1>

                <p className="homeSub">
                  <span className="web">Webentwicklerin</span>
                </p>
              </header>

              <nav ref={sliderNavRef} className="slider-nav" aria-label="Navigation">
                <div className="slider">
                  <NavLink to="/" end>
                    Home
                  </NavLink>
                  <NavLink to="/about">
                    Über<br />
                    mich
                  </NavLink>
                  <NavLink to="/projects">Projekte</NavLink>
                  <span className="highlight" aria-hidden="true"></span>
                </div>
              </nav>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
};

export default Home;