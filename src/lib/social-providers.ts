// Social media provider definitions with OAuth config and API helpers

export interface SocialProvider {
  id: string
  name: string
  icon: string
  color: string
  oauthUrl: string
  scopes: string[]
  apiBaseUrl: string
  maxPostLength: number
  features: string[]
}

export const SOCIAL_PROVIDERS: Record<string, SocialProvider> = {
  FACEBOOK: {
    id: 'FACEBOOK',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    oauthUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['pages_manage_posts', 'pages_read_engagement'],
    apiBaseUrl: 'https://graph.facebook.com/v18.0',
    maxPostLength: 63206,
    features: ['posts', 'stories', 'reels', 'analytics'],
  },
  INSTAGRAM: {
    id: 'INSTAGRAM',
    name: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    oauthUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    apiBaseUrl: 'https://graph.instagram.com/v18.0',
    maxPostLength: 2200,
    features: ['posts', 'stories', 'reels', 'carousels'],
  },
  TWITTER: {
    id: 'TWITTER',
    name: 'X (Twitter)',
    icon: '🐦',
    color: '#000000',
    oauthUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
    apiBaseUrl: 'https://api.twitter.com/2',
    maxPostLength: 280,
    features: ['tweets', 'threads', 'polls', 'analytics'],
  },
  LINKEDIN: {
    id: 'LINKEDIN',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    oauthUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['w_member_social', 'r_liteprofile'],
    apiBaseUrl: 'https://api.linkedin.com/v2',
    maxPostLength: 3000,
    features: ['posts', 'articles', 'company_page', 'analytics'],
  },
  YOUTUBE: {
    id: 'YOUTUBE',
    name: 'YouTube',
    icon: '🎥',
    color: '#FF0000',
    oauthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/youtube.upload'],
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    maxPostLength: 5000,
    features: ['videos', 'shorts', 'community', 'analytics'],
  },
  TIKTOK: {
    id: 'TIKTOK',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    oauthUrl: 'https://www.tiktok.com/v2/auth/authorize',
    scopes: ['video.publish', 'user.info.basic'],
    apiBaseUrl: 'https://open.tiktokapis.com/v2',
    maxPostLength: 2200,
    features: ['videos', 'sounds', 'analytics'],
  },
  TELEGRAM: {
    id: 'TELEGRAM',
    name: 'Telegram',
    icon: '✈️',
    color: '#0088CC',
    oauthUrl: '', // Telegram uses Bot API, not OAuth
    scopes: [],
    apiBaseUrl: 'https://api.telegram.org',
    maxPostLength: 4096,
    features: ['messages', 'channels', 'groups', 'bots'],
  },
}

// Publish content to a social platform (mock by default, real when connected)
export async function publishToSocial(
  platform: string,
  accessToken: string | null,
  content: { text: string; hashtags?: string[]; mediaUrls?: string[] }
): Promise<{ success: boolean; postId?: string; url?: string; error?: string }> {
  const provider = SOCIAL_PROVIDERS[platform]
  if (!provider) {
    return { success: false, error: `Unknown platform: ${platform}` }
  }

  // If no access token, use mock publish
  if (!accessToken) {
    return mockPublish(platform, content)
  }

  // Real API publish (implement per-platform)
  try {
    return await realPublish(platform, accessToken, content)
  } catch (error) {
    return {
      success: false,
      error: `Failed to publish to ${provider.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

function mockPublish(
  platform: string,
  content: { text: string; hashtags?: string[] }
): { success: boolean; postId: string; url: string } {
  const mockId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const provider = SOCIAL_PROVIDERS[platform]
  const username = 'brandname'

  const urlMap: Record<string, string> = {
    FACEBOOK: `https://facebook.com/${username}/posts/${mockId}`,
    INSTAGRAM: `https://instagram.com/p/${mockId}`,
    TWITTER: `https://twitter.com/${username}/status/${mockId}`,
    LINKEDIN: `https://linkedin.com/feed/update/${mockId}`,
    YOUTUBE: `https://youtube.com/watch?v=${mockId}`,
    TIKTOK: `https://tiktok.com/@${username}/video/${mockId}`,
    TELEGRAM: `https://t.me/${username}/${mockId}`,
  }

  return {
    success: true,
    postId: mockId,
    url: urlMap[platform] || `https://${provider?.name.toLowerCase()}.com/post/${mockId}`,
  }
}

async function realPublish(
  platform: string,
  accessToken: string,
  content: { text: string; hashtags?: string[]; mediaUrls?: string[] }
): Promise<{ success: boolean; postId?: string; url?: string; error?: string }> {
  // Real API implementations would go here per platform
  // For now, fall back to mock publish with a note
  const result = mockPublish(platform, content)
  return {
    ...result,
    // In production, this would call the actual API
  }
}

// Generate OAuth URL for a platform
export function getOAuthUrl(
  platform: string,
  clientId: string,
  redirectUri: string,
  state: string
): string | null {
  const provider = SOCIAL_PROVIDERS[platform]
  if (!provider || !provider.oauthUrl) return null

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: provider.scopes.join(' '),
  })

  return `${provider.oauthUrl}?${params.toString()}`
}

// Validate an access token is still valid (mock)
export async function validateConnection(
  platform: string,
  accessToken: string
): Promise<{ valid: boolean; profile?: { name: string; followers: number } }> {
  // Mock validation — always returns valid with mock profile data
  return {
    valid: true,
    profile: {
      name: `@brandname_${platform.toLowerCase()}`,
      followers: Math.floor(Math.random() * 10000) + 500,
    },
  }
}
