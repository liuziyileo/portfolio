export const profile = {
  name: 'profile',
  title: 'Profile & Contact',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string' },
    { name: 'headline', title: 'Headline / Role', type: 'string' },
    { name: 'avatar', title: 'Profile Picture', type: 'image', options: { hotspot: true } },
    {
      name: 'backgroundSticker',
      title: 'Background Doodle Sticker',
      type: 'image',
      description: 'Upload a transparent sketch to pin onto the corkboard background across the portfolio.',
      options: { hotspot: true },
    },
    {
      name: 'backgroundStickerX',
      title: 'Sticker Horizontal Position (%)',
      type: 'number',
      initialValue: 88,
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'backgroundStickerY',
      title: 'Sticker Vertical Position (%)',
      type: 'number',
      initialValue: 72,
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'backgroundStickerRotation',
      title: 'Sticker Rotation (degrees)',
      type: 'number',
      initialValue: 8,
      validation: (Rule) => Rule.min(-30).max(30),
    },
    {
      name: 'categorySettings',
      title: 'Category Appearance',
      type: 'array',
      description: 'Set each category description, accent color, and order on the index page.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: '3D Work', value: '3d' },
                  { title: 'Compositing & 2D', value: 'compositing-2d' },
                  { title: 'Miscellaneous', value: 'misc' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            {
              name: 'color',
              title: 'Accent Color (hex)',
              type: 'string',
              description: 'Enter a hex color such as #C9503D.',
              validation: (Rule) => Rule.regex(/^#[0-9a-fA-F]{6}$/),
            },
            {
              name: 'position',
              title: 'Index Position (1 = first)',
              type: 'number',
              validation: (Rule) => Rule.min(1).max(3),
            },
          ],
          preview: {
            select: { title: 'category', subtitle: 'position' },
          },
        },
      ],
    },
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
