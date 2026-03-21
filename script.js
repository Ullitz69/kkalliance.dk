document.querySelectorAll(".dropbtn").forEach(button => {
  button.addEventListener("click", function (e) {
    e.stopPropagation(); // stopper click fra at lukke med det samme

    const menu = this.nextElementSibling;

    // luk alle andre
    document.querySelectorAll(".dropdown-menu").forEach(m => {
      if (m !== menu) m.classList.remove("show");
    });

    // toggle denne
    menu.classList.toggle("show");
  });
});

// klik udenfor lukker alle
document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.classList.remove("show");
  });
});