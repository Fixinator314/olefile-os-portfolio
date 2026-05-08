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

// ========================= System Time ========================
function updateSystemTime() {
  const timeEl = document.getElementById("top-time");

  const dateEl = document.getElementById("top-date");

  const now = new Date();

  // TIME

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // DATE

  const date = now.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // UPDATE UI

  timeEl.textContent = time;
  dateEl.textContent = date;
}

// RUN ON LOAD

updateSystemTime();

// UPDATE EVERY SECOND

setInterval(updateSystemTime, 1000);

// ========================================
// CALENDAR TOGGLE
// ========================================

const systemTime = document.querySelector(".system-time");

const calendarWidget = document.querySelector(".calendar-widget");

systemTime.addEventListener("click", () => {
  calendarWidget.classList.toggle("active");
});

// CLOSE WHEN CLICKING OUTSIDE

document.addEventListener("click", (e) => {
  const insideCalendar = calendarWidget.contains(e.target);

  const insideTime = systemTime.contains(e.target);

  if (!insideCalendar && !insideTime) {
    calendarWidget.classList.remove("active");
  }
});
