const DEFAULT_TTL_SECONDS = 3600;

function normalizePost(post) {
  const caption = (post.caption || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const mediaType = String(post.media_type || 'IMAGE').toUpperCase();
  const children = Array.isArray(post.children && post.children.data) ? post.children.data : [];
  const firstChild = children.find(item => item && (item.media_url || item.thumbnail_url)) || null;
  const mediaUrl = post.media_url || firstChild?.media_url || post.thumbnail_url || firstChild?.thumbnail_url || '';
  const thumbnailUrl = post.thumbnail_url || firstChild?.thumbnail_url || mediaUrl;

  return {
    id: post.id,
    media_type: mediaType,
    media_url: mediaUrl,
    thumbnail_url: thumbnailUrl,
    permalink: post.permalink || `https://www.instagram.com/p/${post.id}/`,
    caption,
    timestamp: post.timestamp || null
  };
}

module.exports = async function handler(req, res) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v25.0';
  const ttlSeconds = Number(process.env.INSTAGRAM_CACHE_SECONDS || DEFAULT_TTL_SECONDS);
  const cacheDurationMs = Math.max(300, ttlSeconds) * 1000;

  if (!accessToken || !accountId) {
    return res.status(503).json({
      posts: [],
      error: 'Instagram settings are missing. Please add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID in your environment.'
    });
  }

  const cache = globalThis.__instagramFeedCache || { expiresAt: 0, posts: [] };

  if (Date.now() < cache.expiresAt && Array.isArray(cache.posts) && cache.posts.length > 0) {
    res.setHeader('Cache-Control', `public, max-age=${Math.max(300, ttlSeconds)}, stale-while-revalidate=3600`);
    return res.status(200).json({ posts: cache.posts, cachedAt: new Date(cache.expiresAt - cacheDurationMs).toISOString() });
  }

  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'thumbnail_url',
    'timestamp',
    'children{media_type,media_url,thumbnail_url,permalink}'
  ].join(',');

  const endpoint = `https://graph.facebook.com/${apiVersion}/${accountId}/media?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' }
    });

    const payload = await response.json();

    if (!response.ok) {
      const message = payload?.error?.message || 'Instagram API request failed.';
      return res.status(502).json({ posts: [], error: message });
    }

    const posts = Array.isArray(payload.data) ? payload.data.slice(0, 6).map(normalizePost) : [];
    const expiresAt = Date.now() + cacheDurationMs;

    globalThis.__instagramFeedCache = { expiresAt, posts };

    res.setHeader('Cache-Control', `public, max-age=${Math.max(300, ttlSeconds)}, stale-while-revalidate=3600`);
    return res.status(200).json({ posts, cachedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({
      posts: [],
      error: error instanceof Error ? error.message : 'Unknown Instagram API error.'
    });
  }
};
