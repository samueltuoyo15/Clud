import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const SITE_URL = 'https://clud.samueltuoyo.com'
const DEFAULT_IMAGE = 'https://clud.samueltuoyo.com/clud-logo-purple-512x512.png'

const setMeta = (selector: string, attr: 'name' | 'property', value: string) => {
  let meta = document.querySelector(selector)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attr, value)
    document.head.appendChild(meta)
  }
  return meta
}

export const SEO: React.FC<SeoProps> = ({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`

    document.title = title

    setMeta('meta[name="description"]', 'name', 'description').setAttribute(
      'content',
      description,
    )
    setMeta('meta[name="robots"]', 'name', 'robots').setAttribute(
      'content',
      'index, follow',
    )

    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl)

    const socialTags = [
      ['property', 'og:type', type],
      ['property', 'og:url', canonicalUrl],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:image', image],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:url', canonicalUrl],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
      ['name', 'twitter:image', image],
    ] as const

    for (const [attr, key, value] of socialTags) {
      setMeta(`meta[${attr}="${key}"]`, attr, key).setAttribute('content', value)
    }

    const managedJsonLd = document.querySelector('script[data-managed-seo="true"]')
    if (managedJsonLd) {
      managedJsonLd.remove()
    }

    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-managed-seo', 'true')
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [title, description, path, image, type, jsonLd])

  return null
}

export default SEO
