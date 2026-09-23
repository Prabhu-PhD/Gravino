/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root (a stray package-lock.json in the home dir confuses inference).
  outputFileTracingRoot: import.meta.dirname,

  async rewrites() {
    return [
      /* Arun's ui.js asks for portfolio-2.png: a photograph saved as a PNG,
         949KB, the single heaviest asset on the site. Re-encoded as a JPEG it
         is 41KB for the same picture. His file is kept byte-identical, so the
         old path is served the new image instead of editing the reference. */
      { source: "/assets/portfolio-2.png", destination: "/assets/portfolio-2.jpg" },
    ];
  },
};

export default nextConfig;
