/**
 * Resolves static asset paths considering basePath for GitHub Pages static export.
 * Next.js automatically sets basePath for Next Image components, but standard HTML audio/fetch
 * require explicit basePath prefixing in production build.
 */
const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/MOBFT26-GameRally" : "");

export function getAssetPath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}
