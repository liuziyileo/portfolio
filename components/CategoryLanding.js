'use client';

import { useState, useEffect, useRef } from 'react';
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

  // Scroll-triggered fan-out on mobile when section enters center viewport
  useEffect(() => {
    if (!isMobile) {
      setActiveMobileId(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveMobileId(entry.target.getAttribute('data-cat'));
          }
        });
      },
      {
        rootMargin: '-32% 0px -32% 0px',
        threshold: 0.2,
      }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
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
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          padding: 36px 24px 64px;
          box-sizing: border-box;
        }

        @media (min-width: 900px) {
          .landing-wrapper {
            padding: 48px 48px 40px;
          }
        }

        /* TOP BAR */
        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          flex-wrap: wrap;
          z-index: 20;
        }

        .brand-name {
          font-family: var(--font-display), sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .brand-bio {
          font-size: 0.85rem;
          color: #57554E;
          margin: 0.35rem 0 0 0;
          max-width: 380px;
          line-height: 1.45;
          white-space: pre-line;
        }

        .header-links {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .header-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: #141413;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
          transition: border-color 0.2s ease;
        }

        .header-link:hover {
          border-bottom-color: #141413;
        }

        /* CENTER STAGE: 3 HORIZONTAL ON DESKTOP, 3 VERTICAL ON MOBILE */
        .category-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7rem;
          padding: 7rem 0;
          width: 100%;
        }

        @media (min-width: 900px) {
          .category-stage {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            gap: 2rem;
            padding: 4rem 0;
            min-height: 58vh;
          }
        }

        .category-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #141413;
          cursor: pointer;
          padding: 1.5rem 2rem;
          user-select: none;
        }

        .category-index {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #78756E;
          margin-bottom: 0.45rem;
          position: relative;
          z-index: 10;
          transition: color 0.3s ease;
        }

        .category-title {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(1.75rem, 2.7vw, 2.65rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          text-align: center;
          line-height: 1.08;
          margin: 0;
          position: relative;
          z-index: 10;
          background: rgba(249, 247, 241, 0.82);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.25s ease;
        }

        .category-node.is-open .category-title {
          transform: scale(1.04);
        }

        .category-count {
          font-size: 0.72rem;
          font-weight: 600;
          color: #78756E;
          margin-top: 0.45rem;
          position: relative;
          z-index: 10;
          opacity: 0.85;
        }

        /* FLOATING HAND OF CARDS AROUND TEXT */
        .card-fan {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 2;
        }

        .fan-card {
          position: absolute;
          width: 155px;
          aspect-ratio: 16 / 10;
          border-radius: 6px;
          overflow: hidden;
          border: 1.5px solid #141413;
          background-color: #EAE6DC;
          box-shadow: 0 14px 30px rgba(20, 20, 19, 0.14);
          top: 0;
          left: 0;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.45) rotate(0deg);
          transition:
            transform 0.58s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.32s ease;
        }

        @media (min-width: 900px) {
          .fan-card {
            width: 175px;
          }
        }

        .fan-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* SPREAD POSITIONS WHEN HOVERED (DESKTOP) OR SCROLLED INTO VIEW (MOBILE) */
        .category-node.is-open .fan-card-0 {
          opacity: 1;
          transform: translate(calc(-50% - 115px), calc(-50% - 76px)) rotate(-14deg) scale(1);
          transition-delay: 0.02s;
        }

        .category-node.is-open .fan-card-1 {
          opacity: 1;
          transform: translate(-50%, calc(-50% - 102px)) rotate(2deg) scale(1.03);
          transition-delay: 0.06s;
          z-index: 4;
        }

        .category-node.is-open .fan-card-2 {
          opacity: 1;
          transform: translate(calc(-50% + 115px), calc(-50% - 72px)) rotate(15deg) scale(1);
          transition-delay: 0.1s;
        }

        @media (min-width: 900px) {
          .category-node.is-open .fan-card-0 {
            transform: translate(calc(-50% - 135px), calc(-50% - 88px)) rotate(-15deg) scale(1);
          }
          .category-node.is-open .fan-card-1 {
            transform: translate(-50%, calc(-50% - 116px)) rotate(1deg) scale(1.04);
          }
          .category-node.is-open .fan-card-2 {
            transform: translate(calc(-50% + 135px), calc(-50% - 84px)) rotate(16deg) scale(1);
          }
        }
      `}</style>

      <div className="landing-wrapper">
        {/* MINIMAL TOP HEADER */}
        <header className="top-header">
          <div>
            <h1 className="brand-name">{profile?.name || 'Leo Liu'}</h1>
            {profile?.bio && <p className="brand-bio">{profile.bio}</p>}
          </div>

          <nav className="header-links">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="header-link">
                {profile.email}
              </a>
            )}
            {profile?.socials?.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="header-link"
              >
                {s.platform} ↗
              </a>
            ))}
          </nav>
        </header>

        {/* THREE CATEGORY TRIGGERS */}
        <main className="category-stage">
          {CATEGORIES.map((cat) => {
            const items = groupedProjects[cat.id] || [];
            const previewCards = items.slice(0, 3);
            const isOpen = isMobile ? activeMobileId === cat.id : hoveredId === cat.id;

            return (
              <Link
                key={cat.id}
                href={`/work/${cat.id}`}
                data-cat={cat.id}
                ref={(el) => (sectionRefs.current[cat.id] = el)}
                className={`category-node ${isOpen ? 'is-open' : ''}`}
                onMouseEnter={() => !isMobile && setHoveredId(cat.id)}
                onMouseLeave={() => !isMobile && setHoveredId(null)}
              >
                {/* SPRINGING HAND OF 3 ARTWORKS */}
                <div className="card-fan" aria-hidden="true">
                  {previewCards.map((proj, idx) => (
                    <div key={proj._id} className={`fan-card fan-card-${idx}`}>
                      {proj.thumbUrl && (
                        <img src={proj.thumbUrl} alt="" />
                      )}
                    </div>
                  ))}
                </div>

                <span className="category-index">{cat.index}</span>
                <h2 className="category-title">{cat.label}</h2>
                <span className="category-count">
                  {items.length} {items.length === 1 ? 'Work' : 'Works'}
                </span>
              </Link>
            );
          })}
        </main>

        <div />
      </div>
    </>
  );
}