export const profile = {
  name: 'profile',
  title: 'Profile & Contact',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string' },
    { name: 'headline', title: 'Headline / Role', type: 'string' },
    { name: 'avatar', title: 'Profile Picture', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Short Bio', type: 'text' },
    { name: 'email', title: 'Email Address', type: 'string' },
    {
      name: 'socials',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform Name (e.g. ArtStation, LinkedIn)', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' }
          ]
        }
      ]
    }
  ]
};