import { client, urlFor } from '@/lib/sanity';
import { resolveSiteSettings } from '@/lib/site-settings';
import BoardBackdrop from '@/components/BoardBackdrop';
import CategoryLanding from '@/components/CategoryLanding';

export const revalidate = 60;

async function getData() {
  const [profile, projects, settingsDocument] = await Promise.all([
    client.fetch(`*[_type == "profile"][0]`),
    client.fetch(`*[_type == "project"] | order(coalesce(order, 999) asc, _createdAt desc)`),
    client.fetch(`*[_type == "siteSettings"][0]`),
  ]);

  return {
    profile,
    projects,
    siteSettings: resolveSiteSettings(settingsDocument, profile),
  };
}

export default async function Home() {
  const { profile, projects = [], siteSettings } = await getData();

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

  const stickerUrl = siteSettings.backgroundSticker
    ? urlFor(siteSettings.backgroundSticker).width(320).height(320).fit('max').url()
    : null;

  return (
    <>
      <BoardBackdrop
        src={stickerUrl}
        color={siteSettings.boardColor}
        x={siteSettings.backgroundStickerX}
        y={siteSettings.backgroundStickerY}
        rotation={siteSettings.backgroundStickerRotation}
      />
      <CategoryLanding
        profile={profile}
        siteSettings={siteSettings}
        groupedProjects={groupedProjects}
      />
    </>
  );
}
