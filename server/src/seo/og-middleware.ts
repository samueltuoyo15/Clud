import type { INestApplication } from '@nestjs/common';
import type { Request, Response } from 'express';

export const DEFAULT_OG_IMAGE =
  'https://clud.samueltuoyo.com/clud-logo-purple-512x512.png';

export function getFrontendDomain(): string {
  return process.env.FRONTEND_DOMAIN || 'https://clud.samueltuoyo.com';
}

const STATIC_PAGES_META: Record<
  string,
  { title: string; description: string; image?: string; canonicalSlug?: string }
> = {
  '': {
    title: 'Clud | Real-time API Change Detection for Teams',
    description:
      'Clud monitors your OpenAPI and Swagger specifications and sends instant Slack and Email alerts when breaking API changes occur.',
  },
  home: {
    title: 'Clud | Real-time API Change Detection for Teams',
    description:
      'Clud monitors your OpenAPI and Swagger specifications and sends instant Slack and Email alerts when breaking API changes occur.',
  },
  signin: {
    title: 'Sign In | Clud',
    description:
      'Sign in to your Clud account to monitor API contracts and manage team integrations.',
  },
  signup: {
    title: 'Get Started with Clud | API Drift Detection',
    description:
      'Create your Clud account and start monitoring OpenAPI specs with real-time drift alerts.',
  },
  terms: {
    title: 'Terms of Service | Clud',
    description:
      'Read the Clud terms of service for API contract monitoring and workspace management.',
  },
  privacy: {
    title: 'Privacy Policy | Clud',
    description:
      'Read the Clud privacy policy to understand how your data is protected and secured.',
  },
  refunds: {
    title: 'Refund Policy | Clud',
    description:
      'Learn about the Clud refund policy and subscription billing terms.',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildOgHtml({
  title,
  description,
  image,
  pageUrl,
  ogType = 'website',
}: {
  title: string;
  description: string;
  image: string;
  pageUrl: string;
  ogType?: string;
}): string {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safePageUrl = escapeHtml(pageUrl);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <meta property="og:type" content="${escapeHtml(ogType)}" />
  <meta property="og:url" content="${safePageUrl}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:image:secure_url" content="${safeImage}" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:site_name" content="Clud" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${safeImage}" />
  <link rel="canonical" href="${safePageUrl}" />
  <meta http-equiv="refresh" content="0; url=${safePageUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${safePageUrl}">${safePageUrl}</a>...</p>
</body>
</html>`;
}

export function registerOgMiddleware(app: INestApplication): void {
  app.getHttpAdapter().get('/og/:slug', (req: Request, res: Response) => {
    const { slug } = req.params as { slug: string };
    const frontendDomain = getFrontendDomain();

    try {
      const normalizedSlug = (slug || '').toLowerCase();
      const staticMeta = STATIC_PAGES_META[normalizedSlug] || {
        title: 'Clud | Real-time API Change Detection for Teams',
        description:
          'Clud monitors your OpenAPI and Swagger specifications and sends instant Slack and Email alerts when breaking API changes occur.',
      };

      const canonicalSlug = staticMeta.canonicalSlug || normalizedSlug;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');

      return res.status(200).send(
        buildOgHtml({
          title: staticMeta.title,
          description: staticMeta.description,
          image: staticMeta.image || DEFAULT_OG_IMAGE,
          pageUrl: `${frontendDomain}/${canonicalSlug}`,
          ogType: 'website',
        }),
      );
    } catch {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(
        buildOgHtml({
          title: 'Clud | Real-time API Change Detection',
          description: 'Automated API drift detection for teams.',
          image: DEFAULT_OG_IMAGE,
          pageUrl: frontendDomain,
        }),
      );
    }
  });
}
