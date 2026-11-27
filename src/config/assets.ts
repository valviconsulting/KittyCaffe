import type { GuestId } from '../types/game';

/**
 * External Studio Ghibli watercolor illustrations manifest.
 * Drop PNG files into `public/assets/` using these exact filenames —
 * components automatically display them and seamlessly fall back to
 * watercolor inline SVGs while files are not yet present.
 */
export const CAFE_ASSETS = {
  background: './assets/bg-cafe.png',
  marzipan: './assets/cat-marzipan.png',
  guests: {
    puh: './assets/guest-pukh.png',
    persyk: './assets/guest-persyk.png',
    luna: './assets/guest-luna.png',
    marsel: './assets/guest-marsel.png',
    sofiya: './assets/guest-sofia.png',
    miya: './assets/guest-miya.png',
    mandrivnyk: './assets/guest-mandrivnyk.png',
  } satisfies Record<GuestId, string>,
} as const;
