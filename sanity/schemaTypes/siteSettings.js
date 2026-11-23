const categoryOptions = [
  { title: '3D Work', value: '3d' },
  { title: 'Compositing & 2D', value: 'compositing-2d' },
  { title: 'Miscellaneous', value: 'misc' },
];

const defaultCategories = [
  {
    _key: '3d',
    category: '3d',
    description: 'Modeling, Sculpting, Texturing, Lighting, Rigging, Animation, etc.',
    color: '#c9503d',
    position: 1,
  },
  {
    _key: 'compositing-2d',
    category: 'compositing-2d',
    description: 'Keying, Roto, Color, Comping, etc',
    color: '#80628b',
    position: 2,
  },
  {
    _key: 'misc',
    category: 'misc',
    description: 'Electrica, Physical media, etc',
    color: '#548171',
    position: 3,
  },
];

export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  initialValue: {
    homeArtworkSize: 164,
    boardColor: '#b9956e',
    backgroundStickerX: 88,
    backgroundStickerY: 72,
    backgroundStickerRotation: 8,
    categorySettings: defaultCategories,
  },
  fields: [
    {
      name: 'homeArtworkSize',
      title: 'Main-page Artwork Icon Size (px)',
      type: 'number',
      description: 'Controls the size of the artwork cards that fan out over category titles.',
      validation: (Rule) => Rule.min(112).max(240),
    },
    {
      name: 'boardColor',
      title: 'Corkboard Background Color',
      type: 'string',
      description: 'Enter a hex color such as #B9956E.',
      validation: (Rule) => Rule.regex(/^#[0-9a-fA-F]{6}$/),
    },
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
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'backgroundStickerY',
      title: 'Sticker Vertical Position (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'backgroundStickerRotation',
      title: 'Sticker Rotation (degrees)',
      type: 'number',
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
              options: { list: categoryOptions },
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
  ],
};
