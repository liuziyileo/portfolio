import Image from 'next/image';
import Link from 'next/link';
import { client, urlFor } from '@/lib/sanity';

export const revalidate = 60;

const CATEGORY_LABELS = {
  '3d': '3D Work',
  'compositing-2d': 'Compositing & 2D',
  'misc': 'Miscellaneous',
};

function getEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('youtube.com/shorts/')) {
    return url.replace('youtube.com/shorts/', 'youtube.com/embed/');
  }
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'www.youtube.com/embed/');
  }
  if (url.includes('vimeo.com/')) {
    return url.replace('vimeo.com/', 'player.vimeo.com/video/');
  }
  return url;
}

const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  title,
  category,
  year,
  softwareUsed,
  description,
  videoUrl,
  "audioUrl": audioFile.asset->url,
  gallery[]{
    _type,
    caption,
    autoLoop,
    asset->{
      _id,
      url,
      mimeType
    }
  }
}`;

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await client.fetch(projectQuery, { slug });

  if (!project) {
    return (
      <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 24px' }}>
        <h2>Project Not Found</h2>
        <Link href="/" style={{ textDecoration: 'underline', color: '#141413' }}>← Back to Index</Link>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(project.videoUrl);
  const categoryKey = project.category || '3d';
  const categoryLabel = CATEGORY_LABELS[categoryKey] || 'Works';

  return (
    <div style={{ width: '100%', color: '#141413' }}>
      <article
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px 120px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <Link
            href={`/work/${categoryKey}`}
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              borderBottom: '1.5px solid #141413',
              paddingBottom: '2px',
              color: '#141413',
            }}
          >
            ← Back to {categoryLabel}
          </Link>
        </div>

        {/* HEADER */}
        <header style={{ borderBottom: '1px solid var(--line)', paddingBottom: '2rem', marginBottom: '3rem', width: '100%', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              margin: '0 0 0.75rem 0',
              letterSpacing: '-0.03em',
            }}
          >
            {project.title}
          </h1>
          <div
            style={{
              fontSize: '0.82rem',
              color: '#57554E',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
            }}
          >
            {project.year && <span>{project.year}</span>}
            {project.year && project.softwareUsed && <span> • </span>}
            {project.softwareUsed && <span>{project.softwareUsed}</span>}
          </div>
          {project.description && (
            <p style={{ fontSize: '1.02rem', lineHeight: '1.65', color: 'var(--ink)', whiteSpace: 'pre-line', margin: '0 auto', maxWidth: '850px' }}>
              {project.description}
            </p>
          )}

          {/* FEATURED AUDIO PLAYER */}
          {project.audioUrl && (
            <div style={{ marginTop: '1.75rem', maxWidth: '540px' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem', color: '#57554E', textAlign: 'center' }}>
                Audio Track
              </span>
              <audio
                controls
                preload="metadata"
                src={project.audioUrl}
                style={{ width: '100%', height: '40px', borderRadius: '6px' }}
              />
            </div>
          )}
        </header>

        {/* 16:9 RESPONSIVE FULL-WIDTH VIDEO EMBED */}
        {embedUrl && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              backgroundColor: '#141413',
              border: '1.5px solid #141413',
              borderRadius: '6px',
              marginBottom: '4rem',
              overflow: 'hidden',
            }}
          >
            <iframe
              src={embedUrl}
              title="Project Video"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {/* DETAIL STACK (IMAGES, VIDEOS, AND AUDIO FILES) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', width: '100%' }}>
          {project.gallery?.map((item, index) => {
            const isAudio = item._type === 'file' && item.asset?.mimeType?.startsWith('audio/');
            const isVideo = item._type === 'file' && item.asset?.mimeType?.startsWith('video/');

            return (
              <figure
                key={index}
                style={{
                  margin: 0,
                  border: '1.5px solid #141413',
                  borderRadius: '6px',
                  padding: '12px',
                  background: '#F2EFE7',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* UPLOADED AUDIO */}
                {isAudio && item.asset?.url && (
                  <div style={{ padding: '12px 8px' }}>
                    <audio
                      controls
                      preload="metadata"
                      src={item.asset.url}
                      style={{ width: '100%', height: '42px' }}
                    />
                  </div>
                )}

                {/* UPLOADED VIDEO */}
                {isVideo && item.asset?.url && (
                  <video
                    src={item.asset.url}
                    controls={!item.autoLoop}
                    autoPlay={item.autoLoop}
                    loop={item.autoLoop}
                    muted={item.autoLoop}
                    playsInline
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
                  />
                )}

                {/* IMAGE STILL */}
                {item._type === 'image' && item.asset && (
                  <Image
                    src={urlFor(item).width(2000).url()}
                    alt={item.caption || `Detail ${index + 1}`}
                    width={2000}
                    height={1200}
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', borderRadius: '4px' }}
                  />
                )}

                {item.caption && (
                  <figcaption style={{ fontSize: '0.8rem', color: '#57554E', marginTop: '10px', padding: '0 4px' }}>
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </section>
      </article>
    </div>
  );
}
