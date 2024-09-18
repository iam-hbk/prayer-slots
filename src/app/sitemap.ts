import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://prayer-slots.techbk.dev' // Replace with your actual domain

  // Define your routes here
  const routes = [
    '',
    '/about',
    '/contact',
    // Add more routes as needed
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }))
}
