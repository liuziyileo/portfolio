import { client, urlFor } from '@/lib/sanity';
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

  return <CategoryLanding profile={profile} groupedProjects={groupedProjects} />;
}