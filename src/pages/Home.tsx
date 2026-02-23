import React, { useEffect, useMemo, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Portfolio.css";

const Home: React.FC = () => {
  // nur für später: Punkt über dem I in NOTHING’S
  const nothingIRef = useRef<HTMLSpanElement | null>(null);

  // Bubble Layer Ref (da werden bubbles reingehängt)
  const bubbleLayerRef = useRef<HTMLDivElement | null>(null);

  // Ref auf Name (damit wir animationstart abfangen)
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  // Ref auf Slider (damit bubbles "hinter dem Slider" hochsteigen)
  const sliderNavRef = useRef<HTMLElement | null>(null);

  const nameText = "Sandra Nitsch";

  // ✅ langsamer: 0.22s pro Zeichen (vorher 0.16)
  const nameChars = useMemo(() => {
    return [...nameText].map((ch, i) => ({
      ch,
      delay: i * 0.22, // Stagger: Buchstabe für Buchstabe (langsamer)
    }));
  }, [nameText]);

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

      // Mittelpunkt vom Slider -> dort steigen bubbles hoch
      const centerX = sliderRect.left - layerRect.left + sliderRect.width / 2;
      const spread = Math.max(40, sliderRect.width * 0.55);
      const x = centerX + (Math.random() * spread - spread / 2);

      const bubble = document.createElement("span");
      bubble.className = "bubble";

      const size = Math.floor(Math.random() * 18) + 10; // 10..28
      const duration = Math.random() * 1.4 + 3.0; // 3.0..4.4
      const opacity = Math.random() * 0.25 + 0.18;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${x}px`;
      bubble.style.opacity = `${opacity}`;
      bubble.style.animationDuration = `${duration}s`;

      // bubble "startet" optisch hinter dem Slider
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

    // ✅ Starten, sobald die Buchstaben-Animation losgeht
    // Wir hängen uns an den 1. animierten Buchstaben (nameChar)
    const firstChar = titleEl.querySelector(".nameChar") as HTMLElement | null;

    const onStart = () => {
      if (started) return;
      started = true;

      // bubbles starten
      intervalId = window.setInterval(spawnBubble, 240);

      // ✅ Name dauert: (Anzahl-1)*delay + Dauer der Buchstaben-Animation
      // (die CSS Animation-Dauer unten im Kommentar einstellen)
      const totalNameTime =
        (nameChars.length - 1) * 220 + 900; // ms (delay 220ms + ~0.9s char anim)

      // ✅ 3 Sekunden nachdem der Name fertig ist -> bubbles stoppen
      stopTimeoutId = window.setTimeout(() => {
        stopBubbles();
      }, totalNameTime + 3000);
    };

    if (firstChar) {
      firstChar.addEventListener("animationstart", onStart, { once: true });
    } else {
      // Fallback: falls CSS/DOM noch nicht ready ist
      onStart();
    }

    return () => {
      if (firstChar) firstChar.removeEventListener("animationstart", onStart);
      stopBubbles();
      layer.querySelectorAll(".bubble").forEach((b) => b.remove());
    };
  }, [nameChars]);

  return (
    <main className="homePage">
      <section className="homeFrame">
        <section className="homeGrid">
          {/* LEFT: Quote Card */}
          <div className="homeLeft">
            <div className="quoteCard">
              <div className="quoteLines" aria-hidden="true">
                <div className="qLine">
                  <span className="qChar">N</span>
                  <span className="qChar">O</span>
                  <span className="qChar">-</span>
                </div>

                <div className="qLine">
                  <span className="qChar">T</span>
                  <span className="qChar">H</span>
                  <span ref={nothingIRef} className="qChar qI">
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

          {/* RIGHT: Profile + Name + Slider */}
          <aside className="homeRight" aria-label="Profil und Navigation">
            {/* Bubble Layer (liegt hinter dem Inhalt) */}
            <div
              ref={bubbleLayerRef}
              className="bubbleLayer"
              aria-hidden="true"
            />

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
                {/* ✅ Name: Buchstabe-für-Buchstabe */}
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

              <nav
                ref={sliderNavRef}
                className="slider-nav"
                aria-label="Navigation"
              >
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