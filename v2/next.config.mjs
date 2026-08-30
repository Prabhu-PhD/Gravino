/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root (a stray package-lock.json in the home dir confuses inference).
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
