import React, { useState } from "react";
import RightPanelHeader from "../components/RightPanelHeader";
import "../styles/Projekte.css";

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
  linkUrl?: string; // optionaler Link (z.B. Moty)
}

const projects: Project[] = [
  {
    id: "project1",
    title: "Streamflix",
    description:
      "Streamflix ist eine Web-APP nur für Serien – mit vielen visuellen Effekten. Mein Fokus lag darauf, die Seite selbst wie ein Filmerlebnis wirken zu lassen. Cinematic-Style! Sie wurde mit JavaScript und CSS erstellt.",
    image: "/images/BildschirmfotoStreamflix.png",
    videoUrl: "/videos/streamflix.mp4",
  },
  {
    id: "project2",
    title: "Moty",
    description:
      "Web-APP mit eigenem Logo und responsivem Design. Herunterladbar bei Netlify. Motivator mit täglich wechselnden Sprüchen und Bildern. Mittels eines Musikbuttons kann eine Reggae-Playlist aufgerufen werden. Erstellt mit TypeScript, CSS, Tailwind und Inline-Style.",
    image: "/images/DailyMotivatorDesktop.png",
    videoUrl: "/videos/moty.mp4",
    linkUrl: "https://app.netlify.com/projects/peppy-marigold-2a2a40/",
  },
  {
    id: "project3",
    title: "If I lived there",
    description:
      "Web-APP, die anregen soll, darüber nachzudenken, wie der Alltag wäre in einer anderen Stadt – oder sogar in einem anderen Land. Entwickelt habe ich das Projekt mit Next.js, TypeScript und CSS. Responsives Design!",
    image: "/images/If-I-lived-there-thailand.png",
    videoUrl: "/videos/if-i-lived-there.mp4",
  },
];

const Projekte: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const openVideo = (videoUrl: string) => setActiveVideo(videoUrl);
  const closeVideo = () => setActiveVideo(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") closeVideo();
  };

  return (
    <>
      <div className="homePage projectsPage">
        <div className="homeFrame">
          <div className="homeGrid">
            {/* LINKS – Projekte */}
            <main className="homeLeft projectsLeft">
              <div className="projectsPanel">
                <div className="projectsHeader">
                  <h2>PROJEKTE</h2>
                  <div className="projectsRail" />
                </div>

                <div className="projectsGrid">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className={`projectCard project-${project.id}`}
                    >
                      <div className="cardImage">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="imagePlaceholder">{project.title}</div>
                        )}

                        {project.videoUrl && (
                          <button
                            type="button"
                            className="filmIcon"
                            onClick={() => openVideo(project.videoUrl!)}
                            aria-label="Video abspielen"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <rect
                                x="2"
                                y="3"
                                width="20"
                                height="18"
                                rx="2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="2"
                                y1="7"
                                x2="22"
                                y2="7"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="2"
                                y1="17"
                                x2="22"
                                y2="17"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <circle cx="7" cy="5" r="1" fill="currentColor" />
                              <circle cx="12" cy="5" r="1" fill="currentColor" />
                              <circle cx="17" cy="5" r="1" fill="currentColor" />
                              <circle cx="7" cy="19" r="1" fill="currentColor" />
                              <circle cx="12" cy="19" r="1" fill="currentColor" />
                              <circle cx="17" cy="19" r="1" fill="currentColor" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="cardContent">
                        <div className="cardTopRow">
                          <h3>{project.title}</h3>

                          {project.linkUrl && (
                            <a
                              href={project.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cardTopLink"
                            >
                              Projekt ansehen →
                            </a>
                          )}
                        </div>

                        <p>{project.description}</p>
                      </div>
                    </article>
                  ))}

                  {/* "Weitere folgen" an Stelle der entfernten leeren Card */}
                  <div className="moreInline">Weitere folgen</div>
                </div>
              </div>
            </main>

            {/* RECHTS – Neuer Header */}
            <aside className="homeRight projectsRight">
              <RightPanelHeader statement roleText="Webentwicklerin" />
            </aside>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="videoModal active"
          onClick={closeVideo}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="videoContainer" onClick={(e) => e.stopPropagation()}>
            <button
              className="closeModal"
              onClick={closeVideo}
              aria-label="Video schließen"
            >
              ×
            </button>

            <video controls autoPlay>
              <source src={activeVideo} type="video/mp4" />
              Dein Browser unterstützt das Video-Tag nicht.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default Projekte;