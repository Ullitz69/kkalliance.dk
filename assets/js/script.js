document.querySelectorAll(".dropbtn").forEach(button => {
  button.addEventListener("click", function (e) {
    e.stopPropagation();

    const menu = this.nextElementSibling;

    document.querySelectorAll(".dropdown-menu").forEach(m => {
      if (m !== menu) m.classList.remove("show");
    });

    menu.classList.toggle("show");
  });
});

document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.classList.remove("show");
  });
});

window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
/* BURGER MENU */
const burger = document.querySelector(".burger");
const navLeft = document.querySelector(".nav-left");
const navRight = document.querySelector(".nav-right");

burger.addEventListener("click", () => {
  navLeft.classList.toggle("active");
  navRight.classList.toggle("active");
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