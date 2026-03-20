document.querySelectorAll(".dropbtn").forEach(button => {
  button.addEventListener("click", function () {
    const menu = this.nextElementSibling;

    // luk andre åbne
    document.querySelectorAll(".dropdown-menu").forEach(m => {
      if (m !== menu) m.style.display = "none";
    });

    // toggle
    menu.style.display =
      menu.style.display === "block" ? "none" : "block";
  });
});

// klik udenfor lukker menu
document.addEventListener("click", function (e) {
  if (!e.target.matches(".dropbtn")) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      menu.style.display = "none";
    });
  }
});