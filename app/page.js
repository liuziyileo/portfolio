import { client, urlFor } from '@/lib/sanity';
import BoardBackdrop from '@/components/BoardBackdrop';
import CategoryLanding from '@/components/CategoryLanding';

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

  const groupedProjects = {
    '3d': [],
    'compositing-2d': [],
    'misc': [],
  };

  projects.forEach((project) => {
    const cat = project.category && groupedProjects[project.category] ? project.category : '3d';
    groupedProjects[cat].push({
      _id: project._id,
      title: project.title,
      thumbUrl: project.coverImage
        ? urlFor(project.coverImage).width(640).height(400).fit('crop').crop('focalpoint').url()
        : null,
    });
  });

  const stickerUrl = profile?.backgroundSticker
    ? urlFor(profile.backgroundSticker).width(320).height(320).fit('max').url()
    : null;

  return (
    <>
      <BoardBackdrop
        src={stickerUrl}
        color={profile?.boardColor}
        x={profile?.backgroundStickerX}
        y={profile?.backgroundStickerY}
        rotation={profile?.backgroundStickerRotation}
      />
      <CategoryLanding profile={profile} groupedProjects={groupedProjects} />
    </>
  );
}
