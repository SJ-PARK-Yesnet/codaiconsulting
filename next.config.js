/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  
  // 빌드 출력 디렉토리 명시
  distDir: '.next',
  
  images: {
    unoptimized: true,
    domains: ['localhost', 'codaiconsulting.vercel.app', 'yesnet.kr'],
  },
  
  // Vercel 배포를 위한 추가 설정
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'codaiconsulting.vercel.app', 'yesnet.kr'],
    },
  },
  
  // 라우팅 설정
  async rewrites() {
    return [
      {
        source: '/feed.xml',
        destination: '/api/feed.xml',
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml',
      },
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      }
    ];
  }
}

module.exports = nextConfig 