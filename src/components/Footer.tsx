import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <p className="footerText">© 2026 Sandra Nitsch – Portfolio</p>
      <div className="social-links">
        <a href="https://www.linkedin.com/in/dein-profil" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" />
        </a>
        <a href="https://www.instagram.com/dein-profil" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;