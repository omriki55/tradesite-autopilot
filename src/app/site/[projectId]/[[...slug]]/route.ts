import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { exportProjectAsHTML } from '@/lib/html-exporter'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; slug?: string[] } }
) {
  const { projectId, slug } = params

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        domain: true,
        website: {
          include: {
            pages: { orderBy: { order: 'asc' } },
          },
        },
      },
    })

    if (!project?.website) {
      return new NextResponse('<h1>Site not found</h1>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      })
    }

    let widgetIds: string[] = []
    try {
      widgetIds = JSON.parse(project.widgets || '[]')
    } catch {
      widgetIds = []
    }

    const domain = project.domain?.selectedDomain || 'example.com'
    const pages = (
      project.website.pages as Array<{
        slug: string
        title: string
        content: string
        metaTitle?: string
        metaDescription?: string
        pageType: string
      }>
    ).map((p) => ({
      slug: p.slug || 'home',
      title: p.title || '',
      content: typeof p.content === 'string' ? p.content : JSON.stringify(p.content || {}),
      metaTitle: p.metaTitle ?? undefined,
      metaDescription: p.metaDescription ?? undefined,
      pageType: p.pageType || 'page',
    }))

    const files = exportProjectAsHTML({
      brandName: project.brandName,
      domain,
      niche: project.niche || 'forex_broker',
      pages,
      ga4Id: project.ga4Id || undefined,
      gtmId: project.gtmId || undefined,
      chatWidgetProvider: project.chatWidgetProvider || undefined,
      chatWidgetId: project.chatWidgetId || undefined,
      widgets: widgetIds,
    })

    // Determine which file to serve
    const requestedSlug = slug?.join('/') || ''
    let targetPath: string

    if (!requestedSlug || requestedSlug === '' || requestedSlug === 'home') {
      targetPath = 'index.html'
    } else if (requestedSlug === 'style.css') {
      targetPath = 'style.css'
    } else if (requestedSlug === 'robots.txt') {
      targetPath = 'robots.txt'
    } else if (requestedSlug === 'sitemap.xml') {
      targetPath = 'sitemap.xml'
    } else {
      targetPath = `${requestedSlug.replace(/\//g, '-')}.html`
    }

    const file = files.find((f) => f.path === targetPath)

    if (!file) {
      return new NextResponse('<h1>Page not found</h1>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      })
    }

    // Fix internal links to work with the dynamic route
    let content = file.content
    if (targetPath.endsWith('.html')) {
      // Replace href="something.html" with href="/site/{projectId}/something"
      content = content.replace(/href="index\.html"/g, `href="/site/${projectId}"`)
      content = content.replace(/href="([^"]+)\.html"/g, `href="/site/${projectId}/$1"`)
      // Fix stylesheet link
      content = content.replace(
        'href="style.css"',
        `href="/site/${projectId}/style.css"`
      )
    }

    const contentType = targetPath.endsWith('.css')
      ? 'text/css'
      : targetPath.endsWith('.xml')
        ? 'application/xml'
        : targetPath.endsWith('.txt')
          ? 'text/plain'
          : 'text/html'

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    })
  } catch (error) {
    console.error('Site preview error:', error)
    return new NextResponse('<h1>Error loading site</h1>', {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}
