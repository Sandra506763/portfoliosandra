import React from "react";
import RightHeader from "../components/RightHeader";

const About: React.FC = () => {
  return (
    <main className="homePage aboutPage">
      <div className="homeFrame">
        <div className="homeGrid">
          {/* ✅ 70% MAIN (links) */}
          <section className="homeLeft aboutMain">
            {/* Rail-Block (rechts oben im Main-Bereich) */}
            <aside className="aboutRailInMain">
              <div className="rail-block">
                <h3>Quick Facts</h3>
                <ul>
                  <li>Frontend Developer</li>
                  <li>React · Next.js · TypeScript</li>
                  <li>Designaffin</li>
                </ul>
              </div>

              <div className="rail-block">
                <h3>Status</h3>
                <p>Open for opportunities</p>
              </div>

              <div className="rail-block">
                <h3>Focus</h3>
                <p>
                  Clean UI <br />
                  Thoughtful Motion
                </p>
              </div>
            </aside>

            <h2>Über mich</h2>

            <section className="about-text">
              <div>
              Ich bin Webentwicklerin, die gerne Ordnung ins Chaos bringt – mit
              sauberem Code, einzigartigem Design und innovativen Lösungen für
              eine langfristige Architektur.
            </div>

            <div>
              Kreativität war schon immer ein fester Bestandteil meines Lebens –
              sie zieht sich durch mein gesamtes Leben und durch meine gesamte
              Familie. Auch mein Kind wurde davon nicht verschont.
              

<svg
  className="smiley"
  viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <circle className="smiley-face" cx="50" cy="50" r="45" />
  <circle className="smiley-eye-open" cx="35" cy="40" r="3.6" />
  <path
    className="smiley-eye-wink"
    d="M58 42 Q65 38 72 42"
    fill="none"
    strokeLinecap="round"
  />
  <path
    className="smiley-mouth"
    d="M28 56 Q50 76 72 56"
    fill="none"
    strokeLinecap="round"
  />
</svg>
            </div>

            <div>
              Bevor ich diesen kreativen Weg beruflich einschlagen konnte, bin
              ich zunächst den klassischen Schritt einer Ausbildung gegangen und
              habe Industriekauffrau gelernt.
            </div>

            <div>
              Danach war ich zehn Jahre als Disponentin tätig. In dieser Zeit
              konnte ich mein strukturiertes Arbeiten und mein
              Organisationstalent weiter ausbauen. Anschließend war ich im
              Vertriebsinnendienst tätig – der enge Kontakt mit Menschen hat
              mich sehr erfüllt. Und trotzdem fehlte etwas.
            </div>

            <div>
              Erst mein vorletzter Arbeitgeber brachte mich meinem heutigen
              Beruf ein großes Stück näher. Neben administrativen Aufgaben war
              ich dort für den gesamten Ablaufprozess des Unternehmens
              verantwortlich. Es folgte die Prozessoptimierung zweier
              ERP-Systeme, für die ich ebenfalls hauptverantwortlich war.
            </div>

            <div>
              In dieser Zeit merkte ich, wie sehr mir meine analytischen
              Fähigkeiten halfen, mich in IT-Prozesse hineinzuversetzen.
              Zusätzlich war ich für die Shopgestaltung zuständig – zwar nur mit
              einem Baukastensystem, aber genau hier entstand die Verbindung aus
              technischem Prozessverständnis und Freude an Webgestaltung.
            </div>

            <div>
              Aus diesen beiden Komponenten – IT-nahe Abläufe und kreative
              Webentwicklung – wuchs der Wunsch nach einer beruflichen
              Neuorientierung.
            </div>

            <div>
              Es folgte noch ein letzter Arbeitgeber: ein großer internationaler
              Industriekonzern. Als Custom-Order-Processing-Mitarbeiterin war
              ich im nationalen als auch internationalen Umfeld tätig. Die
              Rahmenbedingungen stimmten – gute Bezahlung, nette Kolleg:innen –
              und dennoch blieb dieser Wunsch, kreativ arbeiten zu wollen und
              meine analytischen Fähigkeiten sinnvoll einzusetzen.
            </div>

            <div>
              Ein weiterer Gedanke ließ mich nicht los: Ich war fast 47 Jahre
              alt. Trotzdem fasste ich einen Entschluss –{" "}
              <strong>nichts ist unmöglich</strong>. Ich wollte es mir selbst
              beweisen und auch meinem fast erwachsenen Sohn, der heute übrigens
              einen ganz ähnlichen beruflichen Weg anstrebt.
              <svg
                className="smiley"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle className="smiley-face" cx="50" cy="50" r="45" />
                <circle className="smiley-eye-open" cx="35" cy="40" r="5" />
                <path
                  className="smiley-eye-wink"
                  d="M58 40 Q65 36 72 40"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  className="smiley-mouth"
                  d="M30 58 Q50 72 70 58"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              Mein Resümee: Es ist nie zu spät, seine Träume zu leben – und man
              ist nie zu alt, neue Wege zu gehen.
            </div>

            <div>
              <strong>„Nothing's impossible"</strong> ist dabei mehr als ein
              Motto für mich. Es beschreibt meine Herangehensweise: komplexe
              Anforderungen zu durchdringen, Lösungen strukturiert zu entwickeln
              und Herausforderungen pragmatisch umzusetzen.
            </div>

            <div>
              <strong>Tech-Stack? Klar!</strong> JavaScript & TypeScript, React,
              Next.js, Node.js – alles am Start. Dazu moderne Tools wie bun und
              npm. Backend-Programmierung und API-Schnittstellen
              Implementierung, MongoDB für flexible Datenmodelle sowie
              DevOps-Grundlagen. UI & UX – klare Interfaces, saubere User Flows
              und ein Fokus auf Performance, Wartbarkeit und Struktur gehören
              für mich selbstverständlich zum Entwicklungsprozess.
            </div>

            <div>
              Neben Code habe ich ein Herz für UI & UX. Ich mag Interfaces, die
              intuitiv sind, gut aussehen und nicht erst erklärt werden müssen.
              Wenn sich etwas logisch anfühlt und Spaß macht, bin ich zufrieden.
            </div>

            <div>
              Was mich antreibt? Gute und kreative Ideen, saubere Lösungen und
              der Moment, wenn aus ein paar Zeilen Code ein echtes Produkt wird.
            </div>

            <div>
              <strong>Kurz gesagt:</strong> Ich baue Websites, Webapps, Apps und
              Landingpages mit Anspruch, Persönlichkeit – und einer Lebensweise,
              die sagt: Nothing's impossible!
            </div>
            </section>   {/* Ende .about-text */}
          </section>     {/* Ende .homeLeft */}
                
          <aside className="homeRight">
            <RightHeader />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default About;



              