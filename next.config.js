/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // Vercel 배포를 위한 추가 설정
  experimental: {
    // API 라우트가 정적 내보내기에서도 작동하도록 설정
    appDir: true,
    serverActions: true,
  }
}

module.exports = nextConfig 