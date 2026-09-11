// sanity/schemaTypes/project.js
export const project = {
  name: 'project',
  title: 'Projects',
  type: 'document',
  // Sets default preview order in Studio
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
      validation: (Rule) => Rule.required()
    },
    {
      name: 'coverImage',
      title: 'Cover / Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required()
    },
    { name: 'softwareUsed', title: 'Software / Tools (e.g. Maya, ZBrush, Arnold)', type: 'string' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'description', title: 'Description / Breakdown Notes', type: 'text' },
    {
      name: 'videoUrl',
      title: 'Embed Video Reel URL (Optional YouTube or Vimeo Link)',
      type: 'url'
    },
    {
      name: 'gallery',
      title: 'Detail Gallery (Stills, Breakdown Passes, Turntables)',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Image Still / Render Pass',
          options: { hotspot: true },
          fields: [{ name: 'caption', title: 'Caption / Pass Name', type: 'string' }]
        },
        {
          type: 'file',
          title: 'Uploaded Video File (MP4 Turntable / Clip)',
          options: { accept: 'video/*' },
          fields: [
            { name: 'caption', title: 'Caption (e.g. Turntable 360°)', type: 'string' },
            { 
              name: 'autoLoop', 
              title: 'Auto-play and loop like a GIF?', 
              type: 'boolean', 
              initialValue: true 
            }
          ]
        }
      ]
    }
  ]
};