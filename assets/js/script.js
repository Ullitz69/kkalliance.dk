window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (header && window.scrollY > 10) {
    header.classList.add("scrolled");
  } else if (header) {
    header.classList.remove("scrolled");
  }
});
const instagramConfig = {
  endpoints: [
    "./data/instagram.json",
    "/data/instagram.json",
    "/api/instagram",
    "./api/instagram"
  ],
  profileUrl: "https://www.instagram.com/videblaa/",
  maxPosts: 3
};

function getInstagramTypeLabel(type) {
  const normalized = String(type || "IMAGE").toUpperCase();

  if (normalized === "VIDEO") return "Video";
  if (normalized === "CAROUSEL_ALBUM") return "Carousel";
  if (normalized === "REEL") return "Reel";

  return "Post";
}

function sanitizeInstagramCaption(caption) {
  return (caption || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderInstagramFallback(message) {
  const feed = document.getElementById("instagramFeed");
  const fallback = document.getElementById("instagramFallback");
  const fallbackMessage = document.getElementById("instagramFallbackMessage");

  if (!feed || !fallback || !fallbackMessage) return;

  feed.innerHTML = "";
  fallbackMessage.textContent = message;
  fallback.hidden = false;
}

function createInstagramPost(post) {
  const link = document.createElement("a");
  link.className = "instagram-post";
  link.href = post.permalink || instagramConfig.profileUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Åbn Instagram-opslag fra ${post.caption ? sanitizeInstagramCaption(post.caption) : "@videblaa"}`);

  const image = document.createElement("img");
  image.src = post.thumbnail_url || post.media_url || "";
  image.alt = sanitizeInstagramCaption(post.caption) || "Instagram-opslag fra @videblaa";
  image.loading = "lazy";
  image.decoding = "async";
  image.setAttribute("referrerpolicy", "no-referrer");

  const badge = document.createElement("span");
  badge.className = "instagram-post-badge";
  badge.textContent = getInstagramTypeLabel(post.media_type);

  link.appendChild(image);
  link.appendChild(badge);

  return link;
}

async function loadInstagramFeed() {
  const feed = document.getElementById("instagramFeed");
  const fallback = document.getElementById("instagramFallback");

  if (!feed || !fallback) return;

  let lastErrorText = "Instagram-feedet er ikke tilgængeligt lige nu.";
  let emptyFeedFound = false;

  for (const endpoint of instagramConfig.endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });

      if (!response.ok) {
        lastErrorText = `Instagram-feedet kunne ikke hentes (${response.status}).`;
        continue;
      }

      const data = await response.json();
      const posts = Array.isArray(data.posts)
        ? data.posts
            .filter(post => post && (post.thumbnail_url || post.media_url))
            .sort((a, b) => Date.parse(b.timestamp || "") - Date.parse(a.timestamp || ""))
            .slice(0, instagramConfig.maxPosts)
        : [];

      if (!posts.length) {
        emptyFeedFound = true;
        continue;
      }

      feed.innerHTML = "";
      posts.forEach(post => feed.appendChild(createInstagramPost(post)));
      fallback.hidden = true;
      return;
    } catch (fetchError) {
      lastErrorText = fetchError instanceof Error ? fetchError.message : lastErrorText;
    }
  }

  renderInstagramFallback(
    emptyFeedFound
      ? "Instagram-feedet indeholder ingen opslag lige nu. Følg @videblaa direkte for at se de seneste opslag."
      : `${lastErrorText} Følg @videblaa direkte for at se de seneste opslag.`
  );
}

if (document.getElementById("instagramFeed")) {
  loadInstagramFeed();
}
