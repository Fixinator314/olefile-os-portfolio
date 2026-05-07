const startButton = document.querySelector(".start-button");

const startMenu = document.querySelector(".start-menu");

startButton.addEventListener("click", () => {
  startMenu.classList.toggle("active");
});

// CLOSE WHEN CLICKING OUTSIDE

document.addEventListener("click", (e) => {
  const isClickInside =
    startMenu.contains(e.target) || startButton.contains(e.target);

  if (!isClickInside) {
    startMenu.classList.remove("active");
  }
});
