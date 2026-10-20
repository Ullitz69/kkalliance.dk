const burger = document.querySelector(".burger");
const siteNavigation = document.querySelector("#siteNavigation");
const dropdownButtons = document.querySelectorAll(".site-navigation .dropbtn");

function closeDropdowns() {
  dropdownButtons.forEach(button => {
    button.setAttribute("aria-expanded", "false");
    const menu = document.getElementById(button.getAttribute("aria-controls"));
    if (menu) menu.hidden = true;
  });
}

function closeNavigation(returnFocus = false) {
  if (!burger || !siteNavigation) return;
  siteNavigation.hidden = true;
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "\u00C5bn menu");
  const label = burger.querySelector(".burger-label");
  if (label) label.textContent = "Menu";
  closeDropdowns();
  if (returnFocus) burger.focus();
}

if (burger && siteNavigation) {
  burger.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNavigation();
      return;
    }
    siteNavigation.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Luk menu");
    const label = burger.querySelector(".burger-label");
    if (label) label.textContent = "Luk menu";
  });

  dropdownButtons.forEach(button => {
    button.addEventListener("click", () => {
      const menu = document.getElementById(button.getAttribute("aria-controls"));
      if (!menu) return;
      const isOpen = button.getAttribute("aria-expanded") === "true";
      closeDropdowns();
      if (!isOpen) {
        menu.hidden = false;
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  siteNavigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => closeNavigation());
  });

  document.addEventListener("click", event => {
    if (!siteNavigation.contains(event.target) && !burger.contains(event.target)) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !siteNavigation.hidden) {
      closeNavigation(true);
    }
  });
}

window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (header && window.scrollY > 10) {
    header.classList.add("scrolled");
  } else if (header) {
    header.classList.remove("scrolled");
  }
});
// Player cards on hold page: click or Enter opens player profile page.
const playerCards = document.querySelectorAll(".player-grid .player-card");

if (playerCards.length > 0) {
  playerCards.forEach(card => {
    const name = card.querySelector("h4")?.textContent?.trim() || "Spiller";
    const number = card.querySelector(".number")?.textContent?.trim() || "";
    const position = card.closest(".player-grid")?.previousElementSibling?.textContent?.trim() || "Spiller";

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Se profil for ${name}`);

    const goToProfile = () => {
      const params = new URLSearchParams({
        name,
        number,
        position
      });
      window.location.href = `spiller.html?${params.toString()}`;
    };

    card.addEventListener("click", goToProfile);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        goToProfile();
      }
    });
  });
}

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

  let response;
  let lastErrorText = "Instagram-feedet er ikke tilgængeligt lige nu.";

  try {
    for (const endpoint of instagramConfig.endpoints) {
      try {
        response = await fetch(endpoint, {
          headers: { Accept: "application/json" },
          cache: "no-store"
        });

        if (response.ok) {
          break;
        }

        lastErrorText = `Instagram-feedet kunne ikke hentes (${response.status}).`;
      } catch (fetchError) {
        lastErrorText = fetchError instanceof Error ? fetchError.message : lastErrorText;
      }
    }

    if (!response || !response.ok) {
      throw new Error(lastErrorText);
    }

    const data = await response.json();
    const posts = Array.isArray(data.posts) ? data.posts.slice(0, instagramConfig.maxPosts) : [];

    if (!posts.length) {
      throw new Error("Der blev ikke fundet nye Instagram-opslag.");
    }

    feed.innerHTML = "";
    posts.forEach(post => {
      feed.appendChild(createInstagramPost(post));
    });

    fallback.hidden = true;
  } catch (error) {
    renderInstagramFallback(
      error instanceof Error
        ? `${error.message} Følg @videblaa direkte for at se de seneste opslag.`
        : "Instagram-feedet er ikke tilgængeligt lige nu. Følg @videblaa direkte for at se de seneste opslag."
    );
  }
}

if (document.getElementById("instagramFeed")) {
  loadInstagramFeed();
}