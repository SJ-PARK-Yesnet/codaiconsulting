/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  
  // 빌드 출력 디렉토리 명시
  distDir: '.next',
  
  images: {
    unoptimized: true,
    domains: ['localhost', '*.vercel.app'],
  },
  
  // Vercel 배포를 위한 추가 설정
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },
  
  // 라우팅 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/feed.xml',
        destination: '/api/feed.xml',
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml',
      },
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/',
        destination: '/',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig 