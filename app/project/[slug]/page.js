import Image from 'next/image';
import Link from 'next/link';
import { client, urlFor } from '@/lib/sanity';

export const revalidate = 60;

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
  year,
  softwareUsed,
  description,
  videoUrl,
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
      <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
        <h2>Project Not Found</h2>
        <Link href="/" style={{ textDecoration: 'underline', color: '#000' }}>← Back to Works</Link>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(project.videoUrl);

  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000' }}>
      <article
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px 120px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxSizing: 'border-box',
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: '0.85rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
            display: 'inline-block',
            marginBottom: '2.5rem',
            color: '#000000',
          }}
        >
          ← Back to Works
        </Link>

        {/* HEADER */}
        <header style={{ borderBottom: '2px solid black', paddingBottom: '2rem', marginBottom: '3rem', width: '100%' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: '800',
              margin: '0 0 0.75rem 0',
              letterSpacing: '-0.03em',
            }}
          >
            {project.title}
          </h1>
          <div
            style={{
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              color: '#555',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            {project.year && <span>{project.year}</span>}
            {project.year && project.softwareUsed && <span> • </span>}
            {project.softwareUsed && <span>{project.softwareUsed}</span>}
          </div>
          {project.description && (
            <p style={{ fontSize: '1.05rem', lineHeight: '1.65', color: '#222', whiteSpace: 'pre-line', margin: 0, maxWidth: '850px' }}>
              {project.description}
            </p>
          )}
        </header>

        {/* 16:9 RESPONSIVE FULL-WIDTH EMBED */}
        {embedUrl && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              backgroundColor: '#000000',
              border: '1.5px solid #000000',
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

        {/* ARTSTATION DETAIL STACK */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', width: '100%' }}>
          {project.gallery?.map((item, index) => (
            <figure key={index} style={{ margin: 0, border: '1px solid #000000', padding: '10px', background: '#fafafa', width: '100%', boxSizing: 'border-box' }}>
              {/* UPLOADED VIDEO */}
              {item._type === 'file' && item.asset?.url && (
                <video
                  src={item.asset.url}
                  controls={!item.autoLoop}
                  autoPlay={item.autoLoop}
                  loop={item.autoLoop}
                  muted={item.autoLoop}
                  playsInline
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              )}

              {/* IMAGE STILL */}
              {item._type === 'image' && item.asset && (
                <Image
                  src={urlFor(item).width(2000).url()}
                  alt={item.caption || `Detail ${index + 1}`}
                  width={2000}
                  height={1200}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                />
              )}

              {item.caption && (
                <figcaption style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#444', marginTop: '10px', padding: '0 4px' }}>
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </section>
      </article>
    </div>
  );
}