// Palette inspired by cut-paper collage picture books: textured sky blue,
// warm cream pages, pelican-beak orange, leafy green, driftwood brown and sun yellow.
export const colors = {
  page: '#f4e7cf',
  paper: '#fbf5e8',
  sky: '#4a8fd6',
  skyDeep: '#2f6fb8',
  cloud: '#e8f1fb',
  beak: '#e07a24',
  beakDeep: '#b85d14',
  leaf: '#5e9a3a',
  leafDeep: '#3f7a28',
  leafWash: '#e2ecc6',
  wood: '#7a3f22',
  sun: '#f2c230',
  sunWash: '#fbe7a6',
  rust: '#c4452d',
  rustWash: '#f6d6c6',
  ink: '#2b2622',
  inkSoft: '#5a4c40',
  muted: '#8a7866',
  white: '#ffffff',
} as const;

/** Hard, offset "cut paper" shadow. */
export const paperShadow = (size = 4) => `${size}px ${size + 1}px 0px ${colors.ink}`;
