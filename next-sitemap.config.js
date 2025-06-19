/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://yesnet.kr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 7000,
  // exclude: ['/api/*', '/api-test', '/api-score'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://yesnet.kr/feed.xml',
      'https://yesnet.kr/rss'
    ],
  },
  // 사이트맵 XML 커스텀 헤더 - xmlns 속성 제거
  sitemapBaseFileName: 'sitemap',
  sitemapStylesheet: [
    {
      type: 'text/xsl',
      styleFile: 'sitemap.xsl'
    }
  ],
  transform: async (config, path) => {
    // 끝에 슬래시(/) 제거
    const loc = path.endsWith('/') ? path.slice(0, -1) : path;
    
    return {
      loc: loc,
      // 다른 속성들은 모두 제거
      alternateRefs: [],
    }
  },
  // 사용자 정의 XML 형식 사용
  sourceDir: '.next',
  outDir: 'public',
  cleanNames: true,
} 