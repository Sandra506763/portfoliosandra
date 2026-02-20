import React, { useState } from "react";
import Footer from "../components/Footer";


interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
  comingSoon?: boolean;
}
const projects: Project[] = [
  {
    id: "project1",
    title: "Streamflix",
    description:
      "Streamflix ist eine Streaming-Webseite nur für Serien - mit vielen visuellen Effekten. Mein Fokus lag darauf, die Seite selbst schon wie ein Filmerlebnis wirken zu lassen. Cinematic-Style! Sie wurde mit JavaScript und CSS erstellt.",
    image: "/images/BildschirmfotoStreamflix.png",
    videoUrl: "/videos/streamflix.mp4",
  },
  {
    id: "project2",
    title: "Moty",
    description:
      "Ist eine Web-APP mit eigens konzipiertem Logo und responsivem Design. Herunterladbar als App bei netlify. Moty ist ein Motivator mit täglich wechselnden Sprüchen und Bildern. Mittels eines Musikbuttons kann eine Reggae-Playlist aufgerufen werden. Erstellt habe ich es mit TypeScript, CSS, Tailwind und Inline-Style. Alle drei zusammen war ein wenig herausfordernd, aber nicht unlösbar.",
    image: "/images/DailyMotivatorDesktop.png",
    videoUrl: "/videos/moty.mp4"
  },
  {
    id: "project3",
    title: "If I lived there",
    description:
      "Ist eine Web-APP, die anregen soll, darüber nachzudenken, wie der Alltag wäre in einer anderen Stadt - oder sogar in einem anderen Land. Entwickelt habe ich das Projekt mit Next.js, TypeScript, CSS und ein wenig Inline-Style. Responsives Design!",
    image: "/images/If-I-lived-there-thailand.png",
    videoUrl: "/videos/if-i-lived-there.mp4"
  },
  {
    id: "project4",
    title: "Neues Projekt",
    description: "In Bearbeitung…",
    comingSoon: true,
  },
];

const Projekte: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const openVideo = (videoUrl: string) => {
    setActiveVideo(videoUrl);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeVideo();
    }
  };

  return (
    <>
      <main className="projekte-main">
        <div className="projekte-header">
          <h2>PROJEKTE</h2>
          <div className="orange-line"></div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="card-image">
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  `${project.title} Bild`
                )}
                <div
                  className="film-icon"
                  onClick={() =>
                    project.videoUrl && openVideo(project.videoUrl)
                  }
                  role="button"
                  tabIndex={0}
                  aria-label="Video abspielen"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="2"
                      y="3"
                      width="20"
                      height="18"
                      rx="2"
                      fill="none"
                      stroke="#2e2b29"
                      strokeWidth="2"
                    />
                    <line
                      x1="2"
                      y1="7"
                      x2="22"
                      y2="7"
                      stroke="#2e2b29"
                      strokeWidth="2"
                    />
                    <line
                      x1="2"
                      y1="17"
                      x2="22"
                      y2="17"
                      stroke="#2e2b29"
                      strokeWidth="2"
                    />
                    <circle cx="7" cy="5" r="1" fill="#2e2b29" />
                    <circle cx="12" cy="5" r="1" fill="#2e2b29" />
                    <circle cx="17" cy="5" r="1" fill="#2e2b29" />
                    <circle cx="7" cy="19" r="1" fill="#2e2b29" />
                    <circle cx="12" cy="19" r="1" fill="#2e2b29" />
                    <circle cx="17" cy="19" r="1" fill="#2e2b29" />
                  </svg>
                </div>
              </div>
              <div className="card-content">
  <h3>{project.title}</h3>
  <p>{project.description}</p>

  {project.id === "project2" && (
    <a
      href="https://app.netlify.com/projects/peppy-marigold-2a2a40/"
      target="_blank"
      rel="noopener noreferrer"
      className="project-link"
    >
      Projekt ansehen →
    </a>
  )}
</div>
            </div>
          ))}
        </div>

        <div className="more-coming">
          <div className="pixel-text">Weitere folgen!</div>
        </div>
      </main>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="video-modal active"
          onClick={closeVideo}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
        >
          <div className="video-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
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
