import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = 'https://yesnet.kr';
  const currentDate = new Date().toISOString();
  const logoUrl = 'https://yesnet.kr/yesnet-logo.png';
  const adminEmail = 'yesnet@yesneterp.com';

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>예스넷 ERP 컨설팅</title>
        <description>ERP 컨설팅 및 개발 서비스</description>
        <link>${siteUrl}</link>
        <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml" />
        <language>ko-KR</language>
        <lastBuildDate>${currentDate}</lastBuildDate>
        <managingEditor>${adminEmail} (예스넷)</managingEditor>
        <webMaster>${adminEmail} (예스넷)</webMaster>
        <image>
          <url>${logoUrl}</url>
          <title>예스넷 ERP 컨설팅</title>
          <link>${siteUrl}</link>
        </image>
        <item>
          <title>ERP 컨설팅 서비스</title>
          <description>전문 ERP 컨설팅 서비스를 제공합니다.</description>
          <link>${siteUrl}/ecount-consulting</link>
          <guid>${siteUrl}/ecount-consulting</guid>
          <pubDate>${currentDate}</pubDate>
          <author>${adminEmail} (예스넷)</author>
        </item>
        <item>
          <title>이카운트 API 개발</title>
          <description>이카운트 API를 활용한 맞춤형 솔루션 개발 서비스를 제공합니다.</description>
          <link>${siteUrl}/docs/ecount-api</link>
          <guid>${siteUrl}/docs/ecount-api</guid>
          <pubDate>${currentDate}</pubDate>
          <author>${adminEmail} (예스넷)</author>
        </item>
        <item>
          <title>ERP 비교 분석</title>
          <description>다양한 ERP 시스템 비교 분석 및 추천 서비스</description>
          <link>${siteUrl}/erp-comparison</link>
          <guid>${siteUrl}/erp-comparison</guid>
          <pubDate>${currentDate}</pubDate>
          <author>${adminEmail} (예스넷)</author>
        </item>
        <item>
          <title>회사 소개</title>
          <description>예스넷 ERP 컨설팅 회사를 소개합니다.</description>
          <link>${siteUrl}/company-info</link>
          <guid>${siteUrl}/company-info</guid>
          <pubDate>${currentDate}</pubDate>
          <author>${adminEmail} (예스넷)</author>
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