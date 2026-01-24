import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import type { CharItem } from '../types';

const Header: React.FC = () => {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const [chars, setChars] = useState<CharItem[]>([]);
  const location = useLocation();
  
  // Terminal nur auf About-Seite anzeigen
  const showTerminal = location.pathname === '/about';

  useEffect(() => {
    const text = "Sandra Nitsch";
    const charArray = [...text].map((ch, i) => ({
      char: ch,
      delay: i * 0.15
    }));
    setChars(charArray);
  }, []);

  useEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;

    const spans = h1.querySelectorAll('span');
    const handlers: Array<{ span: Element; handler: () => void }> = [];

    spans.forEach((span, i) => {
      if (chars[i]?.char !== ' ') {
        const handleAnimationStart = () => {
          const bubble = document.createElement('span');
          bubble.className = 'bubble';
          const size = Math.random() * 10 + 6;
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${span.offsetLeft + span.offsetWidth / 2 - size / 2}px`;
          bubble.style.animationDuration = `${2 + Math.random()}s`;
          h1.appendChild(bubble);
          setTimeout(() => bubble.remove(), 3000);
        };
        span.addEventListener('animationstart', handleAnimationStart);
        handlers.push({ span, handler: handleAnimationStart });
      }
    });

    return () => {
      handlers.forEach(({ span, handler }) => {
        span.removeEventListener('animationstart', handler);
      });
    };
  }, [chars]);

  return (
    <header>
      <img
        src="/images/pictureMe.jpg"
        alt="Profilbild"
        className="profile-pic"
      />

      <h1 ref={h1Ref} id="fancy-heading" aria-label="Sandra Nitsch">
        {chars.map((item, i) => (
          item.char === ' ' ? (
            <span 
              key={i} 
              className="space" 
              style={{ animationDelay: `${item.delay}s` }}
              dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
            />
          ) : (
            <span 
              key={i} 
              style={{ animationDelay: `${item.delay}s` }}
            >
              {item.char}
            </span>
          )
        ))}
      </h1>
      <p className="web">Webentwicklerin</p>
      
      <Navigation />

      {/* Mini Terminal - nur auf About-Seite */}
      {showTerminal && (
        <div className="mini-terminal">
          <div className="terminal-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="prompt">&gt;</span> whoami
            </div>
            <div className="terminal-output">Sandra | Frontend Dev</div>
            
            <div className="terminal-line">
              <span className="prompt">&gt;</span> pwd
            </div>
            <div className="terminal-output">/home/sandra/projects/nothing-impossible</div>
            
            <div className="terminal-line">
              <span className="prompt">&gt;</span> cat .env
            </div>
            <div className="terminal-output">
              MINDSET=growth<br />
              COFFEE=essential<br />
              CODE=clean<br />
              DREAMS=achievable
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;