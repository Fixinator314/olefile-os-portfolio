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

    if (windowId === "books-window") {
      setTimeout(() => {
        initPortfolioBook();
      }, 200);
    }

    if (windowId === "books-window") {
      setTimeout(() => {
        if (!portfolioBook) {
          initPortfolioBook();
        }
      }, 300);
    }
  });
});

// ============Taskbar email script
const emailTaskbar = document.getElementById("email-taskbar");
const emailModal = document.getElementById("emailModal");
const emailClose = document.querySelector(".email-close");

emailTaskbar.addEventListener("click", () => {
  emailModal.classList.add("show-email");
});

emailClose.addEventListener("click", () => {
  emailModal.classList.remove("show-email");
});

const emailWindow = document.querySelector(".email-window");
const emailTopbar = document.querySelector(".email-topbar");

let isDragging = false;

let offsetX = 0;
let offsetY = 0;

emailTopbar.addEventListener("mousedown", (e) => {
  isDragging = true;

  offsetX = e.clientX - emailWindow.offsetLeft;
  offsetY = e.clientY - emailWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  emailWindow.style.position = "absolute";

  emailWindow.style.left = `${e.clientX - offsetX}px`;
  emailWindow.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
// ======================================
// EMAILJS INIT
// ======================================

emailjs.init("U5rZmh31ECmnHaw2K");

// ======================================
// CONTACT FORM
// ======================================

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // OPTIONAL LOADING STATE
  const sendBtn = document.querySelector(".send-btn");

  sendBtn.innerText = "Sending...";
  sendBtn.disabled = true;

  emailjs
    .sendForm("service_2ck1wkw", "template_x9em24t", "#contact-form")

    .then(() => {
      // SUCCESS
      sendBtn.innerText = "Message Sent";

      contactForm.reset();

      // RESET BUTTON
      setTimeout(() => {
        sendBtn.innerText = "Send Message";
        sendBtn.disabled = false;
      }, 2500);
    })

    .catch((error) => {
      console.log(error);

      sendBtn.innerText = "Failed";

      setTimeout(() => {
        sendBtn.innerText = "Send Message";
        sendBtn.disabled = false;
      }, 2500);
    });
});

// ==================Click to close Windows======================
const closeButtons = document.querySelectorAll(".close-btn");

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const window = button.closest(".app-window");

    if (!window) return;

    const windowId = window.id;

    window.classList.remove("active-window");

    const matchingIcon = document.querySelector(`[data-window="${windowId}"]`);

    if (matchingIcon) {
      const taskbarId = matchingIcon.dataset.taskbar;
      const taskbarApp = document.getElementById(taskbarId);

      if (taskbarApp) {
        taskbarApp.classList.remove("active-taskbar-app");
      }
    }
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

// ========================================
// SETTINGS APP
// ========================================

const settingsTaskbar = document.getElementById("settings-taskbar");

const settingsWindow = document.getElementById("settings-window");

settingsTaskbar.addEventListener("click", () => {
  settingsWindow.classList.add("active-window");

  settingsTaskbar.classList.add("active-taskbar-app");
});

// ========================================
// WALLPAPER SWITCHER
// ========================================

const wallpaperOptions = document.querySelectorAll(".wallpaper-option");

wallpaperOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const wallpaper = option.dataset.wallpaper;

    // CHANGE BODY BG

    document.body.style.backgroundImage = `
      radial-gradient(
        circle at top left,
        rgba(255,122,0,0.15),
        transparent 35%
      ),
      url(${wallpaper})
      `;

    // ACTIVE STATE

    document.querySelectorAll(".wallpaper-option").forEach((item) => {
      item.classList.remove("active-wallpaper");
    });

    option.classList.add("active-wallpaper");
  });
});

// ========================================
// ACCENT SWITCHER
// ========================================

const accentOptions = document.querySelectorAll(".accent-option");

accentOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const color = option.dataset.color;

    // CHANGE ROOT VARIABLE

    document.documentElement.style.setProperty("--accent", color);

    // ACTIVE STATE

    document.querySelectorAll(".accent-option").forEach((item) => {
      item.classList.remove("active-accent");
    });

    option.classList.add("active-accent");
  });
});

// =======================music window sidebar activation=================

const sidebarItems = document.querySelectorAll("#music-window .sidebar-item");

const musicSections = document.querySelectorAll("#music-window .music-section");

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    // REMOVE ACTIVE SIDEBAR
    sidebarItems.forEach((i) => {
      i.classList.remove("active-sidebar");
    });

    // ADD ACTIVE SIDEBAR
    item.classList.add("active-sidebar");

    // GET TARGET
    const target = item.dataset.tab;

    // HIDE SECTIONS
    musicSections.forEach((section) => {
      section.classList.remove("active-section");
    });

    // SHOW TARGET
    document.getElementById(target).classList.add("active-section");
  });
});

// =======================
// WORK WINDOW SIDEBAR
// =======================

const sidebarItems2 = document.querySelectorAll("#finder-window .sidebar-item");

const workSections = document.querySelectorAll("#finder-window .work-section");

sidebarItems2.forEach((item) => {
  item.addEventListener("click", () => {
    // REMOVE ACTIVE
    sidebarItems2.forEach((i) => {
      i.classList.remove("active-sidebar2");
    });

    // ADD ACTIVE
    item.classList.add("active-sidebar2");

    // TARGET
    const target = item.dataset.tab;

    // HIDE SECTIONS
    workSections.forEach((section) => {
      section.classList.remove("active-section");
    });

    // SHOW TARGET
    document.getElementById(target).classList.add("active-section");
  });
});

// ===========================================================================
let foodBook = null;
let cocktailBook = null;

window.addEventListener("load", () => {
  if (window.innerWidth > 768) {
    initFlipbooks();
  }
});

function initFlipbooks() {
  if (foodBook) foodBook.destroy();
  if (cocktailBook) cocktailBook.destroy();

  const size = getBookSize();

  foodBook = new St.PageFlip(document.getElementById("food-book"), {
    width: size.width,
    height: size.height,
    size: "fixed",
    showCover: true,
  });

  foodBook.loadFromHTML(document.querySelectorAll("#food-book .page"));

  cocktailBook = new St.PageFlip(document.getElementById("cocktail-book"), {
    width: size.width,
    height: size.height,
    size: "fixed",
    showCover: true,
  });

  cocktailBook.loadFromHTML(document.querySelectorAll("#cocktail-book .page"));
}

function getBookSize() {
  return { width: 600, height: 840 };
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    initFlipbooks();
  }
});

// Full Screen
document.querySelectorAll(".expand-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const windowEl = e.target.closest(".app-window");

    if (!windowEl) return;

    if (!windowEl.classList.contains("fullscreen")) {
      windowEl.dataset.top = windowEl.style.top;
      windowEl.dataset.left = windowEl.style.left;
      windowEl.dataset.width = windowEl.style.width;
      windowEl.dataset.height = windowEl.style.height;

      windowEl.classList.add("fullscreen");
    } else {
      windowEl.classList.remove("fullscreen");

      windowEl.style.top = windowEl.dataset.top;
      windowEl.style.left = windowEl.dataset.left;
      windowEl.style.width = windowEl.dataset.width;
      windowEl.style.height = windowEl.dataset.height;
    }
  });
});

// Full Screen Toggle for Taskbar
document.getElementById("fullscreen-toggle").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Light/Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode") ? "light" : "dark",
  );
});
