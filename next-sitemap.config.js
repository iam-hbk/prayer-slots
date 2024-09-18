module.exports = {
  siteUrl: 'https://prayer-slots.techbk.dev', // Replace with your actual domain
  generateRobotsTxt: true,           // Generate robots.txt file
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,                 // Split sitemaps if you have many pages
  exclude: ['/admin/*', '/login/*'], // Optional: Exclude specific routes
};

