import { NextResponse } from 'next/server';

export async function GET() {
  // 사이트 URL 정의
  const siteUrl = 'https://yesnet.kr';

  // 사이트맵에 포함할 경로 목록
  const paths = [
    '',  // 홈 페이지
    '/company-info',
    '/contact',
    '/erp-comparison',
    '/recommendation',
    '/docs/ecount-api',
    '/api-example',
    '/faq',
    '/ecount-consulting',
    '/questionnaire'
  ];

  // XML 헤더 생성
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 각 경로를 XML 형식으로 추가
  paths.forEach(path => {
    xml += '  <url>\n';
    xml += `    <loc>${siteUrl}${path}</loc>\n`;
    xml += '  </url>\n';
  });

  // XML 닫기
  xml += '</urlset>';

  // XML 콘텐츠 타입으로 응답 반환
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
} 