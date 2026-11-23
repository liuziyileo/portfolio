// sanity/schemaTypes/project.js
export const project = {
  name: 'project',
  title: 'Projects',
  type: 'document',
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  fields: [
    { name: 'title', title: 'Project Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'category',
      title: 'Portfolio Category',
      type: 'string',
      options: {
        list: [
          { title: '3D Work', value: '3d' },
          { title: 'Compositing & 2D', value: 'compositing-2d' },
          { title: 'Miscellaneous', value: 'misc' },
        ],
        layout: 'radio',
      },
      initialValue: '3d',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Priority / Order',
      type: 'number',
      description: 'Lower numbers show first (e.g. 1 is top/first, 2 is second, etc.)',
      initialValue: 10,
    },
    {
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover / Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    { name: 'softwareUsed', title: 'Software / Tools (e.g. Maya, ZBrush, NukeX)', type: 'string' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'description', title: 'Description / Breakdown Notes', type: 'text' },
    {
      name: 'videoUrl',
      title: 'Embed Video Reel URL (Optional YouTube or Vimeo Link)',
      type: 'url',
    },
    {
      name: 'audioFile',
      title: 'Featured Audio Track (Optional MP3 / WAV)',
      type: 'file',
      options: { accept: 'audio/*' },
    },
    {
      name: 'gallery',
      title: 'Detail Gallery (Stills, Breakdown Passes, Videos, Audio)',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Image Still / Render Pass',
          options: { hotspot: true },
          fields: [{ name: 'caption', title: 'Caption / Pass Name', type: 'string' }],
        },
        {
          type: 'file',
          title: 'Uploaded Audio or Video File',
          options: { accept: 'audio/*,video/*' },
          fields: [
            { name: 'caption', title: 'Caption / Track Title', type: 'string' },
            {
              name: 'autoLoop',
              title: 'Auto-play and loop video like a GIF?',
              type: 'boolean',
              initialValue: true,
            },
          ],
        },
      ],
    },
  ],
};
