import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/feed',
                '/resume',
                '/dashboard',
                '/api',
                '/opportunities',
                '/applications',
                '/documents',
                '/discover',
                '/essays',
                '/profile'
            ],
        },
        sitemap: 'https://university-automation-app.vercel.app/sitemap.xml',
    };
}
