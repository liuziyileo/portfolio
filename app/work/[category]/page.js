import Link from 'next/link';
import Image from 'next/image';
import { client, urlFor } from '@/lib/sanity';

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

  const projects = await client.fetch(
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
  );

  return (
    <>
      <style>{`
        .section-page {
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px 96px;
          box-sizing: border-box;
        }

        @media (min-width: 900px) {
          .section-page {
            padding: 56px 48px 110px;
          }
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
          color: #141413;
          text-decoration: none;
          border-bottom: 1.5px solid #141413;
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
          background-color: #141413;
          color: #F9F7F1;
          border-color: #141413;
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr;
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
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .work-thumb-wrap {
          border: 1.5px solid #141413;
          border-radius: 6px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background-color: #EAE6DC;
          position: relative;
          margin-bottom: 0.85rem;
        }

        .work-thumb-wrap img {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .work-card:hover .work-thumb-wrap img {
          transform: scale(1.03);
        }
      `}</style>

      <div className="section-page">
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

        <header style={{ borderBottom: '1.5px solid #141413', paddingBottom: '1.75rem', marginBottom: '3rem', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 0.5rem 0',
            }}
          >
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p style={{ fontSize: '0.95rem', color: '#57554E', margin: '0 auto', maxWidth: '640px' }}>
              {meta.subtitle}
            </p>
          )}
        </header>

        {projects.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#57554E' }}>
            No works added to {meta.title} yet. Assign projects to this category in <code>/studio</code>.
          </p>
        ) : (
          <div className="section-grid">
            {projects.map((project) => (
              <article key={project._id} className="work-card">
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
