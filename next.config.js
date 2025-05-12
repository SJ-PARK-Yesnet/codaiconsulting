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
        source: '/rss',
        destination: '/api/feed.xml',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      }
    ];
  },

  async headers() {
    return [
      {
        source: '/feed.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/rss',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ];
  },

  // 정적 파일 생성 설정
  output: 'standalone',
  poweredByHeader: false,
}

module.exports = nextConfig 