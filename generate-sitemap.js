const fs = require('fs')
const path = require('path')

async function generateSitemap() {
  // Import the sitemap function
  const { default: sitemap } = await import('./src/app/sitemap.ts')

  // Generate the sitemap
  const sitemapEntries = sitemap()

  // Convert the sitemap entries to XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries
    .map(
      entry => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
      <changefreq>${entry.changeFrequency}</changefreq>
      <priority>${entry.priority}</priority>
    </url>
  `
    )
    .join('')}
</urlset>`

  // Write the XML to a file
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml)

  console.log('Sitemap generated successfully!')
}

generateSitemap()
