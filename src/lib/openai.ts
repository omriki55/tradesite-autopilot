/**
 * OpenAI Integration for AI content generation
 * Falls back to mock data when OPENAI_API_KEY is not configured
 */

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GenerateOptions {
  messages: ChatMessage[]
  model?: string
  maxTokens?: number
  temperature?: number
}

interface GenerateResult {
  content: string
  isMock: boolean
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

/**
 * Generate content using OpenAI API
 * Falls back to mock when API key is not set
 */
export async function generateAI(options: GenerateOptions): Promise<GenerateResult> {
  const { messages, model = 'gpt-4o-mini', maxTokens = 2000, temperature = 0.7 } = options

  if (!OPENAI_API_KEY) {
    console.log('[AI] No OPENAI_API_KEY set, using mock response')
    return { content: '', isMock: true }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }))
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    return { content, isMock: false }
  } catch (error) {
    console.error('[AI] OpenAI API error:', error)
    // Return mock on error
    return { content: '', isMock: true }
  }
}

/**
 * Generate a blog post
 */
export async function generateBlogPost(topic: string, niche: string = 'forex') {
  const result = await generateAI({
    messages: [
      {
        role: 'system',
        content: `You are an expert content writer for the ${niche} trading industry. Write professional, SEO-optimized blog posts. Return JSON format: {"title": "...", "content": "...(HTML with h2, h3, p, ul, li tags)", "excerpt": "...", "metaTitle": "...", "metaDescription": "..."}`,
      },
      {
        role: 'user',
        content: `Write a comprehensive blog post about: ${topic}`,
      },
    ],
    maxTokens: 3000,
    temperature: 0.7,
  })

  if (result.isMock) {
    return {
      title: topic,
      content: `<h2>${topic}</h2><p>This is a comprehensive guide about ${topic} in the ${niche} trading space.</p><h3>Key Points</h3><ul><li>Understanding the fundamentals of ${topic}</li><li>Best practices for implementing these strategies</li><li>Common mistakes to avoid</li><li>Expert tips for maximizing results</li></ul><p>Risk management is a crucial aspect of successful trading. By following these guidelines, you can improve your trading performance significantly.</p><h3>Conclusion</h3><p>Implementing these strategies requires discipline and consistency. Start with small positions and gradually scale up as you gain confidence.</p>`,
      excerpt: `A comprehensive guide to ${topic} for ${niche} traders.`,
      metaTitle: `${topic} | ${niche.charAt(0).toUpperCase() + niche.slice(1)} Trading Guide`,
      metaDescription: `Learn about ${topic}. Expert insights and strategies for ${niche} traders.`,
      isMock: true,
    }
  }

  try {
    const parsed = JSON.parse(result.content)
    return { ...parsed, isMock: false }
  } catch {
    return {
      title: topic,
      content: result.content,
      excerpt: result.content.slice(0, 160),
      metaTitle: topic,
      metaDescription: result.content.slice(0, 155),
      isMock: false,
    }
  }
}

/**
 * Generate social media content
 */
export async function generateSocialPost(topic: string, platform: string, niche: string = 'forex') {
  const result = await generateAI({
    messages: [
      {
        role: 'system',
        content: `You are a social media manager for a ${niche} trading company. Create engaging ${platform} posts. Return JSON: {"text": "...", "hashtags": ["..."], "callToAction": "..."}`,
      },
      {
        role: 'user',
        content: `Create a ${platform} post about: ${topic}`,
      },
    ],
    maxTokens: 500,
    temperature: 0.8,
  })

  if (result.isMock) {
    return {
      text: `📈 ${topic}\n\nDiscover the latest insights in ${niche} trading. Our experts share actionable tips to help you trade smarter.\n\n💡 Key takeaway: Knowledge is your best trading tool.`,
      hashtags: [`#${niche}`, '#trading', '#finance', '#investment', '#markets'],
      callToAction: 'Follow us for daily trading insights!',
      isMock: true,
    }
  }

  try {
    return { ...JSON.parse(result.content), isMock: false }
  } catch {
    return { text: result.content, hashtags: [], callToAction: '', isMock: false }
  }
}

/**
 * Generate email template content
 */
export async function generateEmailContent(
  type: 'welcome' | 'newsletter' | 'promotion' | 'followup',
  brandName: string,
  niche: string = 'forex'
) {
  const result = await generateAI({
    messages: [
      {
        role: 'system',
        content: `You are an email marketing expert for ${brandName}, a ${niche} trading company. Create professional email content. Return JSON: {"subject": "...", "preheader": "...", "body": "...(HTML)", "callToAction": "..."}`,
      },
      {
        role: 'user',
        content: `Create a ${type} email for our subscribers.`,
      },
    ],
    maxTokens: 1500,
    temperature: 0.7,
  })

  if (result.isMock) {
    const templates: Record<string, { subject: string; preheader: string; body: string; callToAction: string }> = {
      welcome: {
        subject: `Welcome to ${brandName}!`,
        preheader: 'Your trading journey starts here',
        body: `<h2>Welcome to ${brandName}!</h2><p>Thank you for joining our trading community. We're here to help you succeed.</p><p>Get started by exploring our educational resources and market analysis tools.</p>`,
        callToAction: 'Start Trading Now',
      },
      newsletter: {
        subject: `Weekly Market Insights from ${brandName}`,
        preheader: 'This week in the markets',
        body: `<h2>Weekly Market Update</h2><p>Here are the key developments you need to know about this week in the ${niche} markets.</p><ul><li>Market overview and trends</li><li>Key economic events ahead</li><li>Trading opportunities to watch</li></ul>`,
        callToAction: 'Read Full Analysis',
      },
      promotion: {
        subject: `Special Offer from ${brandName}`,
        preheader: 'Limited time offer inside',
        body: `<h2>Exclusive Offer Just for You</h2><p>As a valued member of ${brandName}, we're offering you exclusive access to our premium trading tools and resources.</p>`,
        callToAction: 'Claim Your Offer',
      },
      followup: {
        subject: `We miss you at ${brandName}`,
        preheader: 'Come back and trade with us',
        body: `<h2>We noticed you've been away</h2><p>The markets never sleep, and neither does our commitment to your success. Log back in to see what you've been missing.</p>`,
        callToAction: 'Return to Dashboard',
      },
    }
    return { ...templates[type], isMock: true }
  }

  try {
    return { ...JSON.parse(result.content), isMock: false }
  } catch {
    return { subject: type, preheader: '', body: result.content, callToAction: '', isMock: false }
  }
}
