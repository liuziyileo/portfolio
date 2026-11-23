'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
  { id: '3d', label: '3D Work', index: '01' },
  { id: 'compositing-2d', label: 'Compositing & 2D', index: '02' },
  { id: 'misc', label: 'Miscellaneous', index: '03' },
];

export default function CategoryLanding({ profile, groupedProjects }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeMobileId, setActiveMobileId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveMobileId(entry.target.getAttribute('data-cat'));
          }
        });
      },
      { rootMargin: '-32% 0px -32% 0px', threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <>
      <style>{`
        .landing-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: min(100%, 1440px);
          margin: 0 auto;
          padding: 26px 24px 48px;
        }

        .top-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          text-align: center;
        }

        .brand-name {
          margin: 0;
          font-family: var(--display);
          font-size: clamp(1rem, 1.7vw, 1.25rem);
          font-weight: 650;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .brand-bio {
          max-width: 440px;
          margin: 8px auto 0;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.6;
          white-space: pre-line;
        }

        .header-links {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
        }

        .header-link {
          padding: 7px 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--ink);
          font-size: 0.76rem;
          text-decoration: none;
          transition: color 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .header-link:hover,
        .header-link:focus-visible {
          border-color: var(--ink);
          color: var(--paper);
          background: var(--ink);
        }

        .landing-kicker {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: clamp(46px, 9vh, 92px) 0 0;
          color: var(--muted);
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-align: center;
          text-transform: uppercase;
        }

        .landing-kicker::before,
        .landing-kicker::after {
          width: 30px;
          height: 1px;
          background: var(--accent);
          content: '';
        }

        .category-stage {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(80px, 13vh, 140px);
          padding: 72px 0 100px;
        }

        @media (min-width: 900px) {
          .landing-wrapper { padding: 34px 48px 52px; }
          .category-stage {
            flex-direction: row;
            justify-content: center;
            gap: clamp(72px, 12vw, 190px);
            min-height: 54vh;
            padding: 84px 0 96px;
          }
        }

        .category-node {
          position: relative;
          display: flex;
          min-width: 210px;
          min-height: 112px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          color: var(--ink);
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          user-select: none;
          isolation: isolate;
        }

        .category-node:focus-visible {
          outline: 1px solid var(--accent);
          outline-offset: 12px;
          border-radius: 2px;
        }

        .category-index,
        .category-count {
          position: relative;
          z-index: 3;
          color: var(--muted);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          transition: opacity 240ms ease;
        }

        .category-index { margin-bottom: 8px; }
        .category-count { margin-top: 9px; letter-spacing: 0.06em; }

        .category-title {
          position: relative;
          z-index: 3;
          margin: 0;
          padding: 0 8px;
          font-family: var(--display);
          font-size: clamp(1.8rem, 3.3vw, 2.7rem);
          font-weight: 550;
          letter-spacing: -0.055em;
          line-height: 1.1;
          transition: opacity 260ms ease, transform 420ms var(--ease-out);
        }

        .category-node.is-open .category-title {
          opacity: 0.06;
          transform: scale(0.94);
        }

        .category-node.is-open .category-index,
        .category-node.is-open .category-count { opacity: 0.12; }

        .card-fan {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .fan-card {
          position: absolute;
          top: 0;
          left: 0;
          width: clamp(112px, 13vw, 164px);
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border: 5px solid var(--paper);
          border-radius: 3px;
          background: var(--paper-deep);
          box-shadow: 0 12px 30px rgba(32, 33, 30, 0.18);
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.24) rotate(0deg);
          transition: transform 560ms var(--ease-out), opacity 220ms ease;
        }

        .fan-card img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-node.is-open .fan-card-0 {
          opacity: 1;
          transform: translate(calc(-50% - 90px), calc(-50% + 2px)) rotate(-11deg) scale(1);
          transition-delay: 30ms;
        }

        .category-node.is-open .fan-card-1 {
          z-index: 2;
          opacity: 1;
          transform: translate(-50%, calc(-50% - 4px)) rotate(1deg) scale(1.08);
          transition-delay: 70ms;
        }

        .category-node.is-open .fan-card-2 {
          opacity: 1;
          transform: translate(calc(-50% + 90px), calc(-50% + 4px)) rotate(12deg) scale(1);
          transition-delay: 110ms;
        }

        @media (max-width: 520px) {
          .landing-wrapper { padding-inline: 18px; }
          .category-stage { gap: 70px; padding-block: 64px 76px; }
          .category-node { min-height: 102px; }
          .fan-card { width: 116px; }
          .category-node.is-open .fan-card-0 { transform: translate(calc(-50% - 63px), -50%) rotate(-9deg) scale(1); }
          .category-node.is-open .fan-card-1 { transform: translate(-50%, -50%) rotate(1deg) scale(1.04); }
          .category-node.is-open .fan-card-2 { transform: translate(calc(-50% + 63px), -50%) rotate(10deg) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-title, .category-index, .category-count, .fan-card { transition-duration: 0.01ms; }
        }
      `}</style>

      <div className="landing-wrapper">
        <header className="top-header">
          <div>
            <h1 className="brand-name">{profile?.name || 'Leo Liu'}</h1>
            {profile?.bio && <p className="brand-bio">{profile.bio}</p>}
          </div>

          <nav className="header-links" aria-label="Contact and social links">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="header-link">{profile.email}</a>
            )}
            {profile?.socials?.map((social, index) => (
              <a key={index} href={social.url} target="_blank" rel="noreferrer" className="header-link">
                {social.platform} ↗
              </a>
            ))}
          </nav>
        </header>

        <p className="landing-kicker">Selected work · 2026</p>

        <main className="category-stage" aria-label="Portfolio categories">
          {CATEGORIES.map((category) => {
            const items = groupedProjects[category.id] || [];
            const previewCards = items.slice(0, 3);
            const isOpen = isMobile ? activeMobileId === category.id : hoveredId === category.id;

            return (
              <Link
                key={category.id}
                href={`/work/${category.id}`}
                data-cat={category.id}
                ref={(element) => (sectionRefs.current[category.id] = element)}
                className={`category-node ${isOpen ? 'is-open' : ''}`}
                onMouseEnter={() => !isMobile && setHoveredId(category.id)}
                onMouseLeave={() => !isMobile && setHoveredId(null)}
                onFocus={() => !isMobile && setHoveredId(category.id)}
                onBlur={() => !isMobile && setHoveredId(null)}
              >
                <div className="card-fan" aria-hidden="true">
                  {previewCards.map((project, index) => (
                    <div key={project._id} className={`fan-card fan-card-${index}`}>
                      {project.thumbUrl && (
                        <Image
                          src={project.thumbUrl}
                          alt=""
                          fill
                          sizes="(max-width: 520px) 116px, 164px"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <span className="category-index">{category.index} / 03</span>
                <h2 className="category-title">{category.label}</h2>
                <span className="category-count">
                  {items.length} {items.length === 1 ? 'Work' : 'Works'}
                </span>
              </Link>
            );
          })}
        </main>
      </div>
    </>
  );
}
