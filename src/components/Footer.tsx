import React from "react";
import "../styles/Portfolio.css";

const Footer: React.FC = () => {
  return (
    <footer className="siteFooter">
      <p className="footerText">© 2026 Sandra Nitsch – Portfolio</p>

      <div className="social-links" aria-label="Kontakt und Social Links">
        {/* Modern Mail Icon Button */}
        <a
          className="iconBtn"
          href="mailto:sanitsch78@web.de"
          aria-label="E-Mail senden"
          title="E-Mail"
        >
          <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.25-8 5-8-5V6l8 5 8-5v2.25Z"/>
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          className="iconBtn"
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn öffnen"
          title="LinkedIn"
        >
          <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 23.5h4V7.98h-4V23.5zM8.5 7.98h3.83v2.12h.05c.53-1 1.83-2.12 3.77-2.12 4.03 0 4.78 2.65 4.78 6.1v9.42h-4v-8.35c0-1.99-.03-4.55-2.78-4.55-2.78 0-3.2 2.17-3.2 4.4v8.5h-4V7.98z" />
          </svg>
        </a>

        {/* GitHub */}
        <a
          className="iconBtn"
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub öffnen"
          title="GitHub"
        >
          <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 .5C5.73.5.75 5.6.75 12.02c0 5.13 3.2 9.48 7.65 11.02.56.1.77-.25.77-.54v-2c-3.11.7-3.76-1.35-3.76-1.35-.5-1.33-1.24-1.68-1.24-1.68-1.02-.72.08-.71.08-.71 1.12.08 1.71 1.19 1.71 1.19 1 .74 2.63.53 3.27.4.1-.74.39-1.24.71-1.52-2.48-.29-5.09-1.27-5.09-5.67 0-1.25.43-2.27 1.14-3.07-.12-.29-.5-1.48.11-3.08 0 0 .93-.3 3.05 1.17.88-.25 1.83-.37 2.77-.37s1.88.13 2.77.37c2.11-1.47 3.04-1.17 3.04-1.17.62 1.6.24 2.79.12 3.08.71.8 1.14 1.82 1.14 3.07 0 4.41-2.61 5.38-5.1 5.66.4.36.77 1.07.77 2.15v3.19c0 .3.2.65.78.54 4.44-1.54 7.64-5.9 7.64-11.02C23.25 5.6 18.27.5 12 .5z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          className="iconBtn"
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram öffnen"
          title="Instagram"
        >
          <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.7-2.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;