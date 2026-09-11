import Image from 'next/image';
import Link from 'next/link';
import { client, urlFor } from '@/lib/sanity';

export const revalidate = 60;

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0]`,
    { slug }
  );

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-black">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link href="/" className="underline text-sm uppercase font-mono">← Back Home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 text-black bg-white min-h-screen">
      <Link href="/" className="text-xs font-bold uppercase tracking-wider underline underline-offset-4 mb-8 inline-block">
        ← Back to Works
      </Link>

      <header className="mb-10 pb-6 border-b border-black">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{project.title}</h1>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-600 uppercase mb-4">
          {project.year && <span>{project.year}</span>}
          {project.year && project.softwareUsed && <span>•</span>}
          {project.softwareUsed && <span>{project.softwareUsed}</span>}
        </div>
        {project.description && (
          <p className="text-neutral-800 text-base leading-relaxed whitespace-pre-line">{project.description}</p>
        )}
      </header>

      {/* DETAIL IMAGE STACK */}
      <section className="flex flex-col gap-10">
        {project.gallery?.map((item, index) => (
          <figure key={index} className="border border-black bg-neutral-50 p-2">
            <Image
              src={urlFor(item).width(1600).url()}
              alt={item.caption || `Pass ${index + 1}`}
              width={1600}
              height={1000}
              className="w-full h-auto object-contain"
            />
            {item.caption && (
              <figcaption className="text-xs font-mono text-neutral-600 mt-2 px-1">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </section>
    </article>
  );
}