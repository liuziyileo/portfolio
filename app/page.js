import Link from 'next/link';
import Image from 'next/image';
import { client, urlFor } from '@/lib/sanity';

export const revalidate = 60;

async function getData() {
  const profile = await client.fetch(`*[_type == "profile"][0]`);
  const projects = await client.fetch(
    `*[_type == "project"] | order(coalesce(order, 999) asc, _createdAt desc)`
  );
  return { profile, projects };
}

export default async function Home() {
  const { profile, projects = [] } = await getData();

  return (
    <>
      <style>{`
        /* --- MAIN LAYOUT CONTAINER --- */
        .layout-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 20px 80px;
          min-height: 100vh;
          background-color: #ffffff;
          color: #000000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* --- SLIM SIDEBAR / PROFILE --- */
        .profile-sidebar {
          width: 100%;
          border-bottom: 2px solid #000000;
          padding-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Desktop: Tight, compact left sidebar */
        @media (min-width: 900px) {
          .layout-container {
            flex-direction: row;
            align-items: flex-start;
            gap: 3rem;
            padding: 48px 36px 80px;
          }
          .profile-sidebar {
            width: 220px;
            min-width: 220px;
            position: sticky;
            top: 48px;
            border-bottom: none;
            border-right: 1.5px solid #000000;
            padding-bottom: 0;
            padding-right: 2rem;
            height: calc(100vh - 96px);
            justify-content: space-between;
          }
        }

        /* --- GALLERY GRID --- */
        .gallery-content {
          flex: 1;
          width: 100%;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }

        @media (min-width: 600px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.75rem;
          }
        }

        @media (min-width: 1100px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .project-card:hover .project-thumb {
          transform: scale(1.03);
        }

        /* Hide desktop contact on mobile and vice-versa */
        .desktop-contact {
          display: none;
        }
        .mobile-contact {
          display: block;
        }
        @media (min-width: 900px) {
          .desktop-contact {
            display: flex;
          }
          .mobile-contact {
            display: none;
          }
        }
      `}</style>

      <div className="layout-container">
        {/* COMPACT SIDEBAR */}
        <aside className="profile-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {profile?.avatar && (
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid black', flexShrink: 0 }}>
                <Image
                  src={urlFor(profile.avatar).width(300).height(300).fit('crop').crop('focalpoint').url()}
                  alt={profile.name || 'Profile'}
                  width={84}
                  height={84}
                  priority
                  style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            )}

            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.15' }}>
                {profile?.name || 'Your Name'}
              </h1>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: '0.25rem 0 0 0', color: '#333' }}>
                {profile?.headline || 'Portfolio'}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#555', margin: '0.6rem 0 0 0', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                {profile?.bio}
              </p>
            </div>
          </div>

          {/* COMPACT DESKTOP CONTACT */}
          <div className="desktop-contact" style={{ flexDirection: 'column', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid #e0e0e0' }}>
            <div>
              <span style={{ display: 'block', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                Contact
              </span>
              {profile?.email ? (
                <a href={`mailto:${profile.email}`} style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                  {profile.email}
                </a>
              ) : (
                <span style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.75rem' }}>Email not set</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {profile?.socials?.map((s, idx) => (
                <a 
                  key={idx} 
                  href={s.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: '500', fontSize: '0.8rem' }}
                >
                  {s.platform} ↗
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* WORKS GALLERY GRID */}
        <main className="gallery-content">
          <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '800', marginBottom: '1.5rem' }}>
            Works
          </h2>

          {projects.length === 0 ? (
            <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#666' }}>
              No projects yet. Visit /studio to add one.
            </p>
          ) : (
            <div className="gallery-grid">
              {projects.map((project) => (
                <Link 
                  key={project._id} 
                  href={`/project/${project.slug?.current}`} 
                  className="project-card"
                  style={{ textDecoration: 'none', color: '#000000', display: 'flex', flexDirection: 'column' }}
                >
                  {/* 16:9 CONTAINER */}
                  <div
                    style={{
                      border: '1px solid #000000',
                      overflow: 'hidden',
                      aspectRatio: '16 / 9',
                      backgroundColor: '#f5f5f5',
                      marginBottom: '0.65rem',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    {project.coverImage && (
                      <Image
                        src={urlFor(project.coverImage).width(960).height(540).fit('crop').crop('focalpoint').url()}
                        alt={project.title}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 400px"
                        className="project-thumb"
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          transition: 'transform 0.25s ease',
                        }}
                      />
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
                      {project.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#666' }}>
                      {project.year}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.7rem', fontFamily: 'monospace', textTransform: 'uppercase', color: '#666', margin: '0.2rem 0 0 0' }}>
                    {project.softwareUsed}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* MOBILE CONTACT FOOTER */}
          <footer className="mobile-contact" style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: '2px solid black' }}>
            <span style={{ display: 'block', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Contact
            </span>
            {profile?.email && (
              <a href={`mailto:${profile.email}`} style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px', fontSize: '0.85rem', display: 'block', marginBottom: '0.75rem' }}>
                {profile.email}
              </a>
            )}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              {profile?.socials?.map((s, idx) => (
                <a 
                  key={idx} 
                  href={s.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: '500', fontSize: '0.85rem' }}
                >
                  {s.platform} ↗
                </a>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}