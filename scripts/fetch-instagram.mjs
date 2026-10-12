import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const outputPath = path.resolve(rootDir, process.env.INSTAGRAM_OUTPUT_PATH || 'data/instagram.json');
const token = (process.env.INSTAGRAM_ACCESS_TOKEN || '').trim();
const accountId = (process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '').trim();
const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v20.0';
const maxPosts = Number(process.env.INSTAGRAM_MAX_POSTS || 3);

function buildFallbackFeed() {
  return {
    generatedAt: new Date().toISOString(),
    source: 'instagram',
    posts: []
  };
}

function sanitizeCaption(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePost(rawPost) {
  if (!rawPost || !rawPost.id) {
    return null;
  }

  const media = rawPost.media_type === 'CAROUSEL_ALBUM' && Array.isArray(rawPost.children?.data)
    ? rawPost.children.data[0] || rawPost
    : rawPost;

  const permalink = media.permalink || rawPost.permalink || 'https://www.instagram.com/videblaa/';
  const mediaType = String(media.media_type || rawPost.media_type || 'IMAGE').toUpperCase();

  return {
    id: rawPost.id,
    caption: sanitizeCaption(media.caption || rawPost.caption),
    media_type: mediaType,
    media_url: media.media_url || rawPost.media_url || '',
    thumbnail_url: media.thumbnail_url || rawPost.thumbnail_url || media.media_url || rawPost.media_url || '',
    permalink,
    timestamp: media.timestamp || rawPost.timestamp || new Date().toISOString()
  };
}

function writeFeed(feed) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');
  console.log(`Saved Instagram feed to ${path.relative(rootDir, outputPath)}`);
}

async function fetchPosts() {
  if (!token || !accountId) {
    console.warn('Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID. Writing empty feed for graceful fallback.');
    writeFeed(buildFallbackFeed());
    return;
  }

  const fields = ['id', 'caption', 'media_type', 'media_url', 'thumbnail_url', 'permalink', 'timestamp', 'children{media_type,media_url,thumbnail_url,permalink}'].join(',');
  const url = new URL(`https://graph.facebook.com/${apiVersion}/${accountId}/media`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', String(maxPosts));
  url.searchParams.set('access_token', token);

  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
  } catch (error) {
    throw new Error(`Instagram API request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  const responseText = await response.text();
  let payload;

  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error(`Instagram API returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!response.ok) {
    const errorMessage = payload?.error?.message || 'Unknown Instagram API error';
    throw new Error(`Instagram API request failed (${response.status}): ${errorMessage}`);
  }

  const posts = Array.isArray(payload.data)
    ? payload.data.map(normalizePost).filter(Boolean).slice(0, maxPosts)
    : [];

  writeFeed({
    generatedAt: new Date().toISOString(),
    source: 'instagram',
    posts
  });
}

try {
  await fetchPosts();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  writeFeed(buildFallbackFeed());
  process.exitCode = 1;
}
