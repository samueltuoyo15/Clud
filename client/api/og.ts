import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type VercelLikeRequest = {
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
};

type VercelLikeResponse = {
  status: (code: number) => VercelLikeResponse;
  setHeader: (name: string, value: string) => VercelLikeResponse;
  send: (body: string) => void;
};

const DEFAULT_OG_IMAGE = 'https://clud.samueltuoyo.com/clud-logo-purple-512x512.png';

const STATIC_PAGES_META: Record<
  string,
  { title: string; description: string; image?: string; canonicalSlug?: string }
> = {
  '': {
    title: 'Clud | Real-time API Change Detection for Teams',
    description: 'Clud monitors your OpenAPI and Swagger specifications and sends instant Slack and Email alerts when breaking API changes occur.',
  },
  signin: {
    title: 'Sign In | Clud',
    description: 'Sign in to your Clud account to monitor API contracts and manage team integrations.',
  },
  signup: {
    title: 'Get Started with Clud | API Drift Detection',
    description: 'Create your Clud account and start monitoring OpenAPI specs with real-time drift alerts.',
  },
  terms: {
    title: 'Terms of Service | Clud',
    description: 'Read the Clud terms of service for API contract monitoring and workspace management.',
  },
  privacy: {
    title: 'Privacy Policy | Clud',
    description: 'Read the Clud privacy policy to understand how your data is protected and secured.',
  },
  refunds: {
    title: 'Refund Policy | Clud',
    description: 'Learn about the Clud refund policy and subscription billing terms.',
  },
  dashboard: {
    title: 'Workspace Dashboard | Clud',
    description: 'Monitor your OpenAPI endpoints, track schema drift, and manage team workspaces.',
  },
  'dashboard/integrations': {
    title: 'Integrations and Alert Channels | Clud',
    description: 'Connect Slack and Email notification channels to receive real-time API drift alerts.',
  },
  'dashboard/settings': {
    title: 'Workspace Settings | Clud',
    description: 'Manage workspace members, notifications, and profile settings in Clud.',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getFrontendDomain(req: VercelLikeRequest): string {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || 'https');
  const forwardedHost = String(
    req.headers['x-forwarded-host'] || req.headers.host || 'clud.samueltuoyo.com',
  );
  return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '');
}

function buildDynamicMeta({
  pageUrl,
  title,
  description,
  image,
}: {
  pageUrl: string;
  title: string;
  description: string;
  image: string;
}) {
  return {
    pageUrl: escapeHtml(pageUrl),
    title: escapeHtml(title),
    description: escapeHtml(description),
    image: escapeHtml(image),
  };
}

function injectMetaIntoHtml(
  html: string,
  meta: ReturnType<typeof buildDynamicMeta>,
  ogType = 'website',
): string {
  let updated = html;

  const replacements: Array<[RegExp, string]> = [
    [/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`],
    [
      /<meta\s+name="description"[\s\S]*?>/i,
      `<meta name="description" content="${meta.description}" />`,
    ],
    [
      /<link\s+rel="canonical"[\s\S]*?>/i,
      `<link rel="canonical" href="${meta.pageUrl}" />`,
    ],
    [
      /<meta\s+property="og:type"[\s\S]*?>/i,
      `<meta property="og:type" content="${ogType}" />`,
    ],
    [
      /<meta\s+property="og:url"[\s\S]*?>/i,
      `<meta property="og:url" content="${meta.pageUrl}" />`,
    ],
    [
      /<meta\s+property="og:title"[\s\S]*?>/i,
      `<meta property="og:title" content="${meta.title}" />`,
    ],
    [
      /<meta\s+property="og:description"[\s\S]*?>/i,
      `<meta property="og:description" content="${meta.description}" />`,
    ],
    [
      /<meta\s+property="og:image"[\s\S]*?>/i,
      `<meta property="og:image" content="${meta.image}" />`,
    ],
    [
      /<meta\s+property="og:image:secure_url"[\s\S]*?>/i,
      `<meta property="og:image:secure_url" content="${meta.image}" />`,
    ],
    [
      /<meta\s+name="twitter:url"[\s\S]*?>/i,
      `<meta name="twitter:url" content="${meta.pageUrl}" />`,
    ],
    [
      /<meta\s+name="twitter:title"[\s\S]*?>/i,
      `<meta name="twitter:title" content="${meta.title}" />`,
    ],
    [
      /<meta\s+name="twitter:description"[\s\S]*?>/i,
      `<meta name="twitter:description" content="${meta.description}" />`,
    ],
    [
      /<meta\s+name="twitter:image"[\s\S]*?>/i,
      `<meta name="twitter:image" content="${meta.image}" />`,
    ],
  ];

  for (const [pattern, replacement] of replacements) {
    updated = updated.replace(pattern, replacement);
  }

  return updated;
}

function loadIndexHtml(): string {
  const candidatePaths = [
    join(process.cwd(), 'dist', 'index.html'),
    join(process.cwd(), 'client', 'dist', 'index.html'),
  ];

  for (const filePath of candidatePaths) {
    try {
      return readFileSync(filePath, 'utf-8');
    } catch {
      // try next candidate path
    }
  }

  throw new Error('Unable to locate dist/index.html');
}

function buildSeoBody({
  heading,
  paragraphs,
  links,
}: {
  heading: string;
  paragraphs: string[];
  links?: Array<{ href: string; label: string }>;
}): string {
  const paras = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  const nav =
    links && links.length
      ? `<nav aria-label="Clud"><ul>${links
          .map(
            (l) =>
              `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`,
          )
          .join('')}</ul></nav>`
      : '';
  return `<main><h1>${escapeHtml(heading)}</h1>${paras}${nav}</main>`;
}

function injectBodyContent(html: string, contentHtml: string): string {
  if (html.includes('<div id="root"></div>')) {
    return html.replace(
      '<div id="root"></div>',
      `<div id="root">${contentHtml}</div>`,
    );
  }
  return html.replace('</body>', `${contentHtml}</body>`);
}

function buildFallbackHtml(
  meta: ReturnType<typeof buildDynamicMeta>,
  heading: string,
  contentHtml: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.pageUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${meta.pageUrl}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:image:secure_url" content="${meta.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Clud" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${meta.pageUrl}" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.image}" />
</head>
<body>
  <div id="root">${contentHtml}</div>
</body>
</html>`;
}

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse,
) {
  const rawSlug = req.query.slug ?? req.query.username ?? '';
  const slug = Array.isArray(rawSlug)
    ? rawSlug.filter(Boolean).join('/')
    : rawSlug;

  const normalizedSlug = (slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  const frontendDomain = getFrontendDomain(req);

  res.setHeader('X-Clud-OG-Handler', '1');
  res.setHeader('X-Clud-OG-Slug', normalizedSlug);

  const staticMeta = STATIC_PAGES_META[normalizedSlug] || {
    title: 'Clud | Real-time API Change Detection for Teams',
    description:
      'Clud monitors your OpenAPI and Swagger specifications and sends instant Slack and Email alerts when breaking API changes occur.',
  };
  const canonicalSlug = staticMeta.canonicalSlug || normalizedSlug;

  const meta = buildDynamicMeta({
    pageUrl: `${frontendDomain}/${canonicalSlug}`,
    title: staticMeta.title,
    description: staticMeta.description,
    image: staticMeta.image || DEFAULT_OG_IMAGE,
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');

  const boilerplate =
    'Clud is an automated API drift detection and contract monitoring platform. It tracks changes to OpenAPI and Swagger specifications in real time, alerting development teams via Slack and email before breaking changes hit production.';
  const links = [
    { href: '/', label: 'Home' },
    { href: '/signin', label: 'Sign In' },
    { href: '/signup', label: 'Get Started' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ];

  const seoBody = buildSeoBody({
    heading: staticMeta.title.split('|')[0].trim(),
    paragraphs: [staticMeta.description, boilerplate],
    links,
  });

  try {
    let html = loadIndexHtml();
    html = injectMetaIntoHtml(html, meta, 'website');
    html = injectBodyContent(html, seoBody);
    return res.status(200).send(html);
  } catch {
    return res
      .status(200)
      .send(buildFallbackHtml(meta, staticMeta.title, seoBody));
  }
}
