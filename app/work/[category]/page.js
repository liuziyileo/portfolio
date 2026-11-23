import Link from 'next/link';
import Image from 'next/image';
import BoardBackdrop from '@/components/BoardBackdrop';
import { client, urlFor } from '@/lib/sanity';
import { resolveSiteSettings } from '@/lib/site-settings';

export const revalidate = 60;

const CATEGORY_META = {
  '3d': {
    title: '3D Work',
    subtitle: 'Character sculpting, modeling, rigging, shading, and animation.',
  },
  'compositing-2d': {
    title: 'Compositing & 2D',
    subtitle: 'Visual effects compositing, planar tracking, clean plating, and 2D illustration.',
  },
  'misc': {
    title: 'Miscellaneous',
    subtitle: 'Sound design, hardware prototypes, interactive web, and experimental studies.',
  },
};

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const meta = CATEGORY_META[category] || { title: 'Works', subtitle: '' };

  const [projects, profile, settingsDocument] = await Promise.all([
    client.fetch(
      `*[_type == "project" && coalesce(category, "3d") == $category] | order(coalesce(order, 999) asc, _createdAt desc){
        _id,
        title,
        slug,
        year,
        softwareUsed,
        coverImage,
        "audioUrl": audioFile.asset->url
      }`,
      { category }
    ),
    client.fetch(`*[_type == "profile"][0]{ backgroundSticker, backgroundStickerX, backgroundStickerY, backgroundStickerRotation, boardColor, homeArtworkSize, categorySettings }`),
    client.fetch(`*[_type == "siteSettings"][0]`),
  ]);
  const siteSettings = resolveSiteSettings(settingsDocument, profile);
  const stickerUrl = siteSettings.backgroundSticker
    ? urlFor(siteSettings.backgroundSticker).width(320).height(320).fit('max').url()
    : null;
  const categorySetting = siteSettings.categorySettings?.find((setting) => setting.category === category);
  const description = categorySetting?.description?.trim() || meta.subtitle;
  const accentColor = /^#[0-9a-f]{6}$/i.test(categorySetting?.color || '')
    ? categorySetting.color
    : undefined;

  return (
    <>
      <BoardBackdrop
        src={stickerUrl}
        color={siteSettings.boardColor}
        x={siteSettings.backgroundStickerX}
        y={siteSettings.backgroundStickerY}
        rotation={siteSettings.backgroundStickerRotation}
      />
      <style>{`
        .section-page {
          position: relative;
          z-index: 1;
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px 96px;
          box-sizing: border-box;
        }

        .section-page .pin-mark {
          background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--category-accent, var(--accent)) 42%, white) 0 12%, var(--category-accent, var(--accent)) 36%, color-mix(in srgb, var(--category-accent, var(--accent)) 58%, black) 100%);
        }

        @media (min-width: 900px) {
          .section-page {
            padding: 56px 48px 110px;
          }
        }

        .section-heading {
          margin-bottom: 3rem;
          padding: 36px 24px 24px;
          text-align: center;
        }

        .empty-work-state {
          max-width: 640px;
          margin: 54px auto;
          padding: 38px 24px 26px;
          text-align: center;
        }

        .nav-strip {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 3rem;
          text-align: center;
        }

        .back-link {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
        }

        .pill-nav {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .cat-pill {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(20, 20, 19, 0.25);
          color: #141413;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .cat-pill:hover,
        .cat-pill.active {
          background-color: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr;
          justify-items: center;
          gap: 2.25rem;
        }

        @media (min-width: 650px) {
          .section-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1050px) {
          .section-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .work-card {
          position: relative;
          display: flex;
          width: 100%;
          max-width: 430px;
          flex-direction: column;
          align-items: center;
          padding: 30px 16px 18px;
          border: 1px solid rgba(93, 70, 47, 0.14);
          background: var(--paper);
          box-shadow: 0 10px 24px rgba(57, 37, 20, 0.16), 0 2px 5px rgba(57, 37, 20, 0.1);
          text-align: center;
        }

        .work-card > .pin-mark {
          top: 9px;
        }

        .work-card > a {
          display: block;
          width: 100%;
        }

        .work-thumb-wrap {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 16 / 9;
          margin-bottom: 0.85rem;
          border: 8px solid #fff;
          background: var(--paper-deep);
          box-shadow: 0 2px 8px rgba(57, 37, 20, 0.13);
        }

        .work-thumb-wrap img {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .work-card:hover .work-thumb-wrap img {
          transform: scale(1.03);
        }
      `}</style>

      <div className="section-page" style={accentColor ? { '--category-accent': accentColor } : undefined}>
        <div className="nav-strip">
          <Link href="/" className="back-link">
            ← Index
          </Link>

          <nav className="pill-nav">
            {Object.entries(CATEGORY_META).map(([key, item]) => (
              <Link
                key={key}
                href={`/work/${key}`}
                className={`cat-pill ${category === key ? 'active' : ''}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <header className="section-heading pinned-paper">
          <span className="pin-mark" aria-hidden="true" />
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(1.54rem, 3.15vw, 2.52rem)',
              fontWeight: 650,
              letterSpacing: '-0.04em',
              margin: '0 0 0.5rem 0',
            }}
          >
            {meta.title}
          </h1>
          {description && (
            <p style={{ fontSize: '0.95rem', color: '#57554E', margin: '0 auto', maxWidth: '640px' }}>
              {description}
            </p>
          )}
        </header>

        {projects.length === 0 ? (
          <p className="empty-work-state pinned-paper">
            <span className="pin-mark" aria-hidden="true" />
            No works added to {meta.title} yet. Assign projects to this category in <code>/studio</code>.
          </p>
        ) : (
          <div className="section-grid">
            {projects.map((project) => (
              <article key={project._id} className="work-card">
                <span className="pin-mark" aria-hidden="true" />
                <Link
                  href={`/project/${project.slug?.current}`}
                  style={{ textDecoration: 'none', color: '#141413' }}
                >
                  <div className="work-thumb-wrap">
                    {project.coverImage && (
                      <Image
                        src={urlFor(project.coverImage).width(960).height(540).fit('crop').crop('focalpoint').url()}
                        alt={project.title}
                        fill
                        sizes="(max-width: 650px) 100vw, (max-width: 1050px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '0.75rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                      {project.title}
                    </h2>
                    <span style={{ fontSize: '0.78rem', color: '#57554E', flexShrink: 0 }}>
                      {project.year}
                    </span>
                  </div>

                  {project.softwareUsed && (
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#57554E', margin: '0.3rem 0 0 0', textAlign: 'center' }}>
                      {project.softwareUsed}
                    </p>
                  )}
                </Link>

                {/* INLINE AUDIO PLAYBACK IF TRACK ATTACHED */}
                {project.audioUrl && (
                  <audio
                    controls
                    preload="metadata"
                    src={project.audioUrl}
                    style={{
                      width: '100%',
                      height: '36px',
                      marginTop: '0.75rem',
                      borderRadius: '6px',
                    }}
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
