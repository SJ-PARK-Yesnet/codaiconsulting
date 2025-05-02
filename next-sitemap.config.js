/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://yesnet.kr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/api/*', '/api-test', '/api-score', '/feed.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/api-test', '/api-score'],
      },
    ],
  },
} 