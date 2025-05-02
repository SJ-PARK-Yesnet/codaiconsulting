import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://codaiconsulting.com';
  const currentDate = new Date().toISOString();

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>코다이컨설팅</title>
        <description>ERP 컨설팅 및 개발 서비스</description>
        <link>${siteUrl}</link>
        <atom:link href="${siteUrl}/api/feed.xml" rel="self" type="application/rss+xml" />
        <language>ko-KR</language>
        <lastBuildDate>${currentDate}</lastBuildDate>
        <item>
          <title>ERP 컨설팅 서비스</title>
          <description>전문 ERP 컨설팅 서비스를 제공합니다.</description>
          <link>${siteUrl}/services</link>
          <guid>${siteUrl}/services</guid>
          <pubDate>${currentDate}</pubDate>
        </item>
        <item>
          <title>API 연동 서비스</title>
          <description>다양한 ERP 시스템과의 API 연동 서비스를 제공합니다.</description>
          <link>${siteUrl}/api-integration</link>
          <guid>${siteUrl}/api-integration</guid>
          <pubDate>${currentDate}</pubDate>
        </item>
      </channel>
    </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 