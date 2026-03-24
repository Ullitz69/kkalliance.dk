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