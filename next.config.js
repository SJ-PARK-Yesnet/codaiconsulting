/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  
  // 빌드 출력 디렉토리 명시
  distDir: '.next',
  
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  
  // Vercel 배포를 위한 추가 설정
  experimental: {
    // API 라우트가 정적 내보내기에서도 작동하도록 설정
    appDir: true,
    serverActions: true,
  },
  
  // 기본 404 페이지 처리
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/',
        },
      ],
    };
  },
}

module.exports = nextConfig 