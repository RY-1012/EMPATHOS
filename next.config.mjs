/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Tauri expects a static export
  distDir: process.env.TAURI_PLATFORM ? '../dist' : '.next',
}

export default nextConfig
