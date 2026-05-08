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
// LIVE CALENDAR
// ========================================

function generateCalendar() {
  const calendarGrid = document.getElementById("calendar-grid");

  const calendarMonth = document.getElementById("calendar-month");

  // CLEAR

  calendarGrid.innerHTML = "";

  // CURRENT DATE

  const now = new Date();

  const year = now.getFullYear();

  const month = now.getMonth();

  const today = now.getDate();

  // MONTH NAME

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  calendarMonth.textContent = `${monthNames[month]} ${year}`;

  // DAYS LABELS

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  days.forEach((day) => {
    const dayLabel = document.createElement("span");

    dayLabel.textContent = day;

    calendarGrid.appendChild(dayLabel);
  });

  // FIRST DAY OF MONTH

  const firstDay = new Date(year, month, 1).getDay();

  // DAYS IN MONTH

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // EMPTY CELLS

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");

    empty.classList.add("calendar-day", "empty");

    calendarGrid.appendChild(empty);
  }

  // ACTUAL DAYS

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");

    dayElement.classList.add("calendar-day");

    dayElement.textContent = day;

    // ACTIVE DAY

    if (day === today) {
      dayElement.classList.add("active-day");
    }

    calendarGrid.appendChild(dayElement);
  }
}

// RUN

generateCalendar();
// ========================================
// CALENDAR TOGGLE
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  const systemTime = document.querySelector(".system-time");

  const calendarWidget = document.querySelector(".calendar-widget");

  // TOGGLE

  systemTime.addEventListener("click", () => {
    calendarWidget.classList.toggle("active");
  });

  // CLOSE OUTSIDE

  document.addEventListener("click", (e) => {
    const insideCalendar = calendarWidget.contains(e.target);

    const insideTime = systemTime.contains(e.target);

    if (!insideCalendar && !insideTime) {
      calendarWidget.classList.remove("active");
    }
  });
});

// ==================Draggable JS======================

const desktopItems = document.querySelectorAll(".desktop-item");

desktopItems.forEach((item) => {
  let offsetX = 0;
  let offsetY = 0;

  let isDragging = false;

  item.addEventListener("mousedown", (e) => {
    isDragging = true;

    item.classList.add("dragging");

    offsetX = e.clientX - item.offsetLeft;

    offsetY = e.clientY - item.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    item.style.left = `${e.clientX - offsetX}px`;

    item.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;

    item.classList.remove("dragging");
  });
});

// ==================Click to Open Windows======================
const desktopIcons = document.querySelectorAll(".desktop-item");

desktopIcons.forEach((icon) => {
  icon.addEventListener("dblclick", () => {
    const windowId = icon.dataset.window;

    const taskbarId = icon.dataset.taskbar;

    const targetWindow = document.getElementById(windowId);

    const taskbarApp = document.getElementById(taskbarId);

    // OPEN WINDOW

    targetWindow.classList.add("active-window");

    // ACTIVATE TASKBAR ICON

    taskbarApp.classList.add("active-taskbar-app");
  });
});

// ==================Click to close Windows======================
const closeButtons = document.querySelectorAll(".close-btn");

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const window = button.closest(".app-window");

    // WINDOW ID

    const windowId = window.id;

    // FIND MATCHING TASKBAR APP

    const matchingIcon = document.querySelector(`[data-window="${windowId}"]`);

    const taskbarId = matchingIcon.dataset.taskbar;

    const taskbarApp = document.getElementById(taskbarId);

    // CLOSE WINDOW

    window.classList.remove("active-window");

    // REMOVE ACTIVE STATE

    taskbarApp.classList.remove("active-taskbar-app");
  });
});

// ========================================
// PROFILE CARD OPEN
// ========================================

const profileCard = document.querySelector(".user-profile-card");

profileCard.addEventListener("click", () => {
  const windowId = profileCard.dataset.window;

  const targetWindow = document.getElementById(windowId);

  targetWindow.classList.add("active-window");
});

// ==================Draggable Windows======================
const windows = document.querySelectorAll(".app-window");

windows.forEach((windowEl) => {
  const header = windowEl.querySelector(".window-header");

  let isDragging = false;

  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;

    offsetX = e.clientX - windowEl.offsetLeft;

    offsetY = e.clientY - windowEl.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    windowEl.style.left = `${e.clientX - offsetX}px`;

    windowEl.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
});
