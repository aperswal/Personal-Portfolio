/**
 * Wallpaper backgrounds, served as WebP from the Vercel Blob CDN (uploaded via
 * scripts/upload-to-blob.mjs). Kept off /public so the large binaries do not
 * live in the repo. Referenced as CSS background images (not next/image), so the
 * next.config remotePatterns allowlist does not apply here.
 */
const BLOB = "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/wallpapers";

/** Desktop background. */
export const WALLPAPER_DESKTOP = `${BLOB}/desktop.webp`;
/** Mobile home background in portrait orientation. */
export const WALLPAPER_MOBILE_PORTRAIT = `${BLOB}/mobile-portrait.webp`;
/** Mobile home background in landscape orientation. */
export const WALLPAPER_MOBILE_LANDSCAPE = `${BLOB}/mobile-landscape.webp`;
