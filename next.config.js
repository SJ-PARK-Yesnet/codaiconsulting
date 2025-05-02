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
  
  // 기본 404 페이지 처리
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
    ];
  },

  // API 라우트 설정
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
        permanent: true,
      },
      {
        source: '/feed.xml',
        destination: '/api/feed.xml',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig 