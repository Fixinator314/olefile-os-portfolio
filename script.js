function updateSystemTime() {
  const timeEl = document.getElementById("top-time");
  const dateEl = document.getElementById("top-date");

  if (!timeEl || !dateEl) return;

  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  timeEl.textContent = time;
  dateEl.textContent = date;
}

function generateCalendar() {
  const calendarGrid = document.getElementById("calendar-grid");
  const calendarMonth = document.getElementById("calendar-month");

  if (!calendarGrid || !calendarMonth) return;

  calendarGrid.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

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

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  days.forEach((day) => {
    const dayLabel = document.createElement("span");
    dayLabel.textContent = day;
    calendarGrid.appendChild(dayLabel);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("calendar-day", "empty");
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day");
    dayElement.textContent = day;

    if (day === today) {
      dayElement.classList.add("active-day");
    }

    calendarGrid.appendChild(dayElement);
  }
}

function getBookSize() {
  return { width: 600, height: 840 };
}

function toggleFullscreen() {
  const doc = document;
  const docEl = document.documentElement;

  const request =
    docEl.requestFullscreen ||
    docEl.webkitRequestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.msRequestFullscreen;

  const exit =
    doc.exitFullscreen ||
    doc.webkitExitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.msExitFullscreen;

  const isFullscreen =
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement;

  if (!isFullscreen) {
    request?.call(docEl);
  } else {
    exit?.call(doc);
  }
}

function applySavedSettings(settings) {
  const {
    themeToggle,
    glowToggle,
    transparencyToggle,
    lockIconsToggle,
    navbarToggle,
    performanceToggle,
    videoToggle,
  } = settings;

  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
      themeToggle.checked = true;
    } else {
      document.body.classList.remove("light-mode");
      themeToggle.checked = false;
    }
  }

  if (glowToggle && localStorage.getItem("glow") === "true") {
    document.body.classList.add("disable-glow");
    glowToggle.checked = true;
  }

  if (performanceToggle && localStorage.getItem("performance") === "true") {
    document.body.classList.add("performance-mode");
    performanceToggle.checked = true;
  }

  if (transparencyToggle && localStorage.getItem("transparency") === "true") {
    document.body.classList.add("reduce-transparency");
    transparencyToggle.checked = true;
  }

  if (lockIconsToggle && localStorage.getItem("lockIcons") === "true") {
    document.body.classList.add("icons-locked");
    lockIconsToggle.checked = true;
  }

  if (navbarToggle && localStorage.getItem("navbar") === "true") {
    document.body.classList.add("disable-navbar-hide");
    navbarToggle.checked = true;
  }

  if (videoToggle) {
    const videosDisabled = localStorage.getItem("videosDisabled") === "true";
    videoToggle.checked = videosDisabled;

    document.querySelectorAll("video").forEach((video) => {
      if (videosDisabled) {
        video.pause();
      } else {
        video.play();
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector(".start-button");
  const startMenu = document.querySelector(".start-menu");

  if (startButton && startMenu) {
    startButton.addEventListener("click", () => {
      startMenu.classList.toggle("active");
    });
  }

  document.addEventListener("click", (e) => {
    if (startMenu && startButton) {
      const isClickInside =
        startMenu.contains(e.target) || startButton.contains(e.target);

      if (!isClickInside) {
        startMenu.classList.remove("active");
      }
    }
  });

  updateSystemTime();
  setInterval(updateSystemTime, 1000);

  generateCalendar();

  const systemTime = document.querySelector(".system-time");
  const calendarWidget = document.querySelector(".calendar-widget");

  if (systemTime && calendarWidget) {
    systemTime.addEventListener("click", () => {
      calendarWidget.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      const insideCalendar = calendarWidget.contains(e.target);
      const insideTime = systemTime.contains(e.target);

      if (!insideCalendar && !insideTime) {
        calendarWidget.classList.remove("active");
      }
    });
  }

  const desktopItems = document.querySelectorAll(".desktop-item");
  desktopItems.forEach((item) => {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    item.addEventListener("mousedown", (e) => {
      if (document.body.classList.contains("icons-locked")) return;

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
      if (!isDragging) return;
      isDragging = false;
      item.classList.remove("dragging");
    });
  });

  const desktopIcons = document.querySelectorAll(".desktop-item");

  desktopIcons.forEach((icon) => {
    icon.addEventListener("dblclick", () => {
      const windowId = icon.dataset.window;
      const taskbarId = icon.dataset.taskbar;

      if (!windowId) return;

      const targetWindow = document.getElementById(windowId);

      if (!targetWindow) {
        console.error(`Window not found: ${windowId}`);
        return;
      }

      // Open the window
      targetWindow.classList.add("active-window");

      // Only activate taskbar item if one exists
      if (taskbarId) {
        const taskbarApp = document.getElementById(taskbarId);

        if (taskbarApp) {
          taskbarApp.classList.add("active-taskbar-app");
        }
      }

      // Portfolio book initialization
      if (windowId === "books-window") {
        setTimeout(() => {
          initPortfolioBook?.();
        }, 200);
      }
    });
  });

  const emailTaskbar = document.getElementById("email-taskbar");
  const emailModal = document.getElementById("emailModal");
  const emailClose = document.querySelector(".email-close");
  const emailWindow = document.querySelector(".email-window");
  const emailTopbar = document.querySelector(".email-topbar");

  if (emailTaskbar && emailModal) {
    emailTaskbar.addEventListener("click", () => {
      emailModal.classList.add("show-email");
    });
  }

  if (emailClose && emailModal) {
    emailClose.addEventListener("click", () => {
      emailModal.classList.remove("show-email");
    });
  }

  if (emailTopbar && emailWindow) {
    let isDraggingEmail = false;
    let emailOffsetX = 0;
    let emailOffsetY = 0;

    emailTopbar.addEventListener("mousedown", (e) => {
      isDraggingEmail = true;
      emailOffsetX = e.clientX - emailWindow.offsetLeft;
      emailOffsetY = e.clientY - emailWindow.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDraggingEmail) return;
      emailWindow.style.position = "absolute";
      emailWindow.style.left = `${e.clientX - emailOffsetX}px`;
      emailWindow.style.top = `${e.clientY - emailOffsetY}px`;
    });

    document.addEventListener("mouseup", () => {
      isDraggingEmail = false;
    });
  }

  if (window.emailjs) {
    emailjs.init("U5rZmh31ECmnHaw2K");
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const sendBtn = document.querySelector(".send-btn");
      if (!sendBtn) return;

      sendBtn.innerText = "Sending...";
      sendBtn.disabled = true;

      emailjs
        .sendForm("service_2ck1wkw", "template_x9em24t", "#contact-form")
        .then(() => {
          sendBtn.innerText = "Message Sent";
          contactForm.reset();
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
  }

  const closeButtons = document.querySelectorAll(".close-btn");

  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const appWindow = button.closest(".app-window");

      if (!appWindow) return;

      appWindow.classList.remove("active-window");
      appWindow.classList.remove("window-focused");
      appWindow.classList.remove("is-dragging");

      const windowId = appWindow.id;

      const matchingIcon = document.querySelector(
        `[data-window="${windowId}"]`,
      );

      if (matchingIcon) {
        const taskbarId = matchingIcon.dataset.taskbar;

        if (taskbarId) {
          const taskbarApp = document.getElementById(taskbarId);

          if (taskbarApp) {
            taskbarApp.classList.remove("active-taskbar-app");
          }
        }
      }
    });
  });

  const profileCard = document.querySelector(".user-profile-card");
  if (profileCard) {
    profileCard.addEventListener("click", () => {
      const windowId = profileCard.dataset.window;
      const targetWindow = document.getElementById(windowId);
      if (targetWindow) {
        targetWindow.classList.add("active-window");
      }
    });
  }

  /* =========================================================
   PORTFOLIO OS — WINDOW MANAGER
   ========================================================= */

  const appWindows = document.querySelectorAll(".app-window");

  function bringWindowToFront(windowEl) {
    if (!windowEl) return;

    appWindows.forEach((win) => {
      win.classList.remove("window-focused");
    });

    windowEl.classList.add("window-focused");
  }

  function openAppWindow(windowEl, taskbarId = null) {
    if (!windowEl) return;

    windowEl.classList.add("active-window");
    bringWindowToFront(windowEl);

    if (taskbarId) {
      const taskbarApp = document.getElementById(taskbarId);

      if (taskbarApp) {
        taskbarApp.classList.add("active-taskbar-app");
      }
    }
  }

  function closeAppWindow(windowEl) {
    if (!windowEl) return;

    windowEl.classList.remove("active-window");
    windowEl.classList.remove("window-focused");

    const windowId = windowEl.id;

    const matchingIcon = document.querySelector(`[data-window="${windowId}"]`);

    if (matchingIcon) {
      const taskbarId = matchingIcon.dataset.taskbar;

      if (taskbarId) {
        const taskbarApp = document.getElementById(taskbarId);

        if (taskbarApp) {
          taskbarApp.classList.remove("active-taskbar-app");
        }
      }
    }
  }

  /* =========================================================
   WINDOW DRAGGING
   ========================================================= */

  appWindows.forEach((windowEl) => {
    const header = windowEl.querySelector(".window-header");

    if (!header) return;

    let isDraggingWindow = false;
    let windowOffsetX = 0;
    let windowOffsetY = 0;

    header.addEventListener("mousedown", (e) => {
      /*
      Don't start dragging when clicking window controls.
    */
      if (
        e.target.closest(
          ".close-btn, .minimize-btn, .expand-btn, button, a, input, textarea, select",
        )
      ) {
        return;
      }

      e.preventDefault();

      bringWindowToFront(windowEl);

      /*
      Convert the window from CSS positioning into
      explicit pixel positioning before dragging.

      This prevents conflicts with:
      left: 50%;
      transform: translateX(-50%);
    */
      const rect = windowEl.getBoundingClientRect();

      windowEl.style.transform = "none";
      windowEl.style.position = "fixed";
      windowEl.style.left = `${rect.left}px`;
      windowEl.style.top = `${rect.top}px`;

      windowOffsetX = e.clientX - rect.left;
      windowOffsetY = e.clientY - rect.top;

      isDraggingWindow = true;

      windowEl.classList.add("is-dragging");
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDraggingWindow) return;

      const windowWidth = windowEl.offsetWidth;
      const windowHeight = windowEl.offsetHeight;

      const maxX = window.innerWidth - windowWidth;
      const maxY = window.innerHeight - windowHeight;

      let newX = e.clientX - windowOffsetX;
      let newY = e.clientY - windowOffsetY;

      /*
      Keep the window at least partially inside
      the viewport.
    */
      newX = Math.max(0, Math.min(newX, Math.max(0, maxX)));

      newY = Math.max(0, Math.min(newY, Math.max(0, maxY)));

      windowEl.style.left = `${newX}px`;
      windowEl.style.top = `${newY}px`;
    });

    document.addEventListener("mouseup", () => {
      if (!isDraggingWindow) return;

      isDraggingWindow = false;

      windowEl.classList.remove("is-dragging");
    });

    /*
    Clicking anywhere inside a window brings it forward.
  */
    windowEl.addEventListener("mousedown", () => {
      bringWindowToFront(windowEl);
    });
  });

  const settingsTaskbar = document.getElementById("settings-taskbar");
  const settingsWindow = document.getElementById("settings-window");

  if (settingsTaskbar && settingsWindow) {
    settingsTaskbar.addEventListener("click", () => {
      settingsWindow.classList.add("active-window");
      settingsTaskbar.classList.add("active-taskbar-app");
    });
  }

  const wallpaperOptions = document.querySelectorAll(".wallpaper-option");
  wallpaperOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const wallpaper = option.dataset.wallpaper;
      if (!wallpaper) return;

      document.body.style.backgroundImage = `
        radial-gradient(
          circle at top left,
          rgba(255,122,0,0.15),
          transparent 35%
        ),
        url(${wallpaper})
      `;
      localStorage.setItem("wallpaper", wallpaper);

      wallpaperOptions.forEach((item) =>
        item.classList.remove("active-wallpaper"),
      );
      option.classList.add("active-wallpaper");
    });
  });

  const accentOptions = document.querySelectorAll(".accent-option");
  accentOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const color = option.dataset.color;
      if (!color) return;

      document.documentElement.style.setProperty("--accent", color);
      accentOptions.forEach((item) => item.classList.remove("active-accent"));
      option.classList.add("active-accent");
    });
  });

  const sidebarItems = document.querySelectorAll("#music-window .sidebar-item");
  const musicSections = document.querySelectorAll(
    "#music-window .music-section",
  );
  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      sidebarItems.forEach((i) => i.classList.remove("active-sidebar"));
      item.classList.add("active-sidebar");

      const target = item.dataset.tab;
      musicSections.forEach((section) =>
        section.classList.remove("active-section"),
      );

      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.classList.add("active-section");
      }
    });
  });

  const sidebarItems2 = document.querySelectorAll(
    "#finder-window .sidebar-item",
  );
  const workSections = document.querySelectorAll(
    "#finder-window .work-section",
  );
  sidebarItems2.forEach((item) => {
    item.addEventListener("click", () => {
      sidebarItems2.forEach((i) => i.classList.remove("active-sidebar2"));
      item.classList.add("active-sidebar2");

      const target = item.dataset.tab;
      workSections.forEach((section) =>
        section.classList.remove("active-section"),
      );

      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.classList.add("active-section");
      }
    });
  });

  const emailNav = document.querySelectorAll(".email-nav");
  const emailSections = document.querySelectorAll(".email-section");
  emailNav.forEach((item) => {
    item.addEventListener("click", () => {
      emailNav.forEach((nav) => nav.classList.remove("active-mail"));
      item.classList.add("active-mail");

      const target = item.dataset.tab;
      emailSections.forEach((section) =>
        section.classList.remove("active-section"),
      );

      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.classList.add("active-section");
      }
    });
  });

  const settingsTabs = document.querySelectorAll(".settings-tab");
  const settingsSections = document.querySelectorAll(".settings-section");
  settingsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      settingsTabs.forEach((t) => t.classList.remove("active-settings-tab"));
      settingsSections.forEach((s) => s.classList.remove("active-section"));

      tab.classList.add("active-settings-tab");
      const target = document.getElementById(tab.dataset.tab);
      if (target) {
        target.classList.add("active-section");
      }
    });
  });

  const themeToggle = document.getElementById("themeToggle");
  const glowToggle = document.getElementById("glowToggle");
  const navbarToggle = document.getElementById("navbarToggle");
  const transparencyToggle = document.getElementById("transparencyToggle");
  const lockIconsToggle = document.getElementById("lockIconsToggle");
  const performanceToggle = document.getElementById("performanceToggle");
  const videoToggle = document.getElementById("videoToggle");

  if (glowToggle) {
    glowToggle.addEventListener("change", () => {
      document.body.classList.toggle("disable-glow");
      localStorage.setItem("glow", glowToggle.checked);
    });
  }

  if (transparencyToggle) {
    transparencyToggle.addEventListener("change", () => {
      document.body.classList.toggle("reduce-transparency");
      localStorage.setItem("transparency", transparencyToggle.checked);
    });
  }

  if (lockIconsToggle) {
    lockIconsToggle.addEventListener("change", () => {
      document.body.classList.toggle("icons-locked");
      localStorage.setItem("lockIcons", lockIconsToggle.checked);
    });
  }

  if (navbarToggle) {
    navbarToggle.addEventListener("change", () => {
      document.body.classList.toggle("disable-navbar-hide");
      localStorage.setItem("navbar", navbarToggle.checked);
    });
  }

  if (performanceToggle) {
    performanceToggle.addEventListener("change", () => {
      document.body.classList.toggle("performance-mode");
      localStorage.setItem("performance", performanceToggle.checked);
    });
  }

  if (videoToggle) {
    videoToggle.addEventListener("change", () => {
      document.querySelectorAll("video").forEach((video) => {
        if (videoToggle.checked) {
          video.pause();
        } else {
          video.play();
        }
      });

      localStorage.setItem("videosDisabled", videoToggle.checked);
    });
  }

  const resetButton = document.getElementById("resetOS");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      document.body.classList.toggle("light-mode");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode") ? "light" : "dark",
      );
    });
  }

  applySavedSettings({
    themeToggle,
    glowToggle,
    transparencyToggle,
    lockIconsToggle,
    navbarToggle,
    performanceToggle,
    videoToggle,
  });

  const fullscreenToggle = document.getElementById("fullscreen-toggle");

  if (fullscreenToggle) {
    fullscreenToggle.addEventListener("click", toggleFullscreen);
  }

  const navbar = document.querySelector(".system-navbar");
  if (navbar) {
    document.addEventListener("mousemove", (e) => {
      if (document.body.classList.contains("disable-navbar-hide")) {
        navbar.classList.add("show-navbar");
        return;
      }

      if (e.clientY <= 15 || navbar.matches(":hover")) {
        navbar.classList.add("show-navbar");
      } else {
        navbar.classList.remove("show-navbar");
      }
    });

    navbar.addEventListener("mouseleave", () => {
      if (!document.body.classList.contains("disable-navbar-hide")) {
        navbar.classList.remove("show-navbar");
      }
    });
  }
});

// Battery Indicator
const batteryLevel = document.getElementById("battery-level");

const batteryFill = document.getElementById("battery-fill");

if ("getBattery" in navigator) {
  navigator.getBattery().then((battery) => {
    function updateBattery() {
      const level = Math.round(battery.level * 100);

      batteryLevel.textContent = `${level}%`;

      batteryFill.style.width = `${level}%`;

      /* Colors */

      if (level <= 20) {
        batteryFill.style.background = "#ff3b30";
      } else if (level <= 50) {
        batteryFill.style.background = "#ff9500";
      } else {
        batteryFill.style.background = "#ffffff";
      }

      /* Charging */

      if (battery.charging) {
        batteryFill.style.background = "#30d158";
      }
      if (battery.charging) {
        batteryFill.classList.add("charging");
      } else {
        batteryFill.classList.remove("charging");
      }
    }

    updateBattery();

    battery.addEventListener("levelchange", updateBattery);

    battery.addEventListener("chargingchange", updateBattery);
  });
}

// Battery Charging status
// function updateBattery() {
//   const level = Math.round(battery.level * 100);

//   batteryLevel.textContent = `${level}%${battery.charging ? " ⚡" : ""}`;
// }

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

// Hide and Show navbar on hover
const navbar = document.querySelector(".system-navbar");

document.addEventListener("mousemove", (e) => {
  if (document.body.classList.contains("disable-navbar-hide")) {
    navbar.classList.add("show-navbar");

    return;
  }

  if (e.clientY <= 15) {
    navbar.classList.add("show-navbar");
  }
});

navbar.addEventListener("mouseleave", () => {
  if (document.body.classList.contains("disable-navbar-hide")) {
    return;
  }

  navbar.classList.remove("show-navbar");
});

// ========================================
// TRASH FILES
// ========================================

const trashCards = document.querySelectorAll(".trash-card");

trashCards.forEach((card) => {
  card.addEventListener("dblclick", () => {
    alert(
      `"${card.querySelector("h3").textContent}" was permanently deleted, You're not supposed to open this anyway🤦🏾`,
    );
  });
});

const arcadeWindow = document.getElementById("arcade-window");

const launchAirHockey = document.getElementById("launch-air-hockey");

const arcadeBackBtn = document.getElementById("arcade-back-btn");

const arcadeHome = arcadeWindow?.querySelector(".arcade-home");

const hockeyScreen = document.getElementById("hockey-screen");

launchAirHockey?.addEventListener("click", () => {
  arcadeHome.classList.remove("active-arcade-screen");

  hockeyScreen.classList.add("active-arcade-screen");

  requestAnimationFrame(() => {
    resetHockeyMatch();

    setTimeout(() => {
      servePuck();
    }, 700);
  });
});

arcadeBackBtn?.addEventListener("click", () => {
  showArcadeHome();
});

function showArcadeHome() {
  hockeyScreen?.classList.remove("active-arcade-screen");
  arcadeHome?.classList.add("active-arcade-screen");
}

// =================================Arcade Logic=====================

/* =========================================================
   AIR HOCKEY
   STEP 2B - PLAYER PADDLE MOVEMENT
========================================================= */

const hockeyTable = document.getElementById("hockey-table");
const playerPaddle = document.getElementById("player-paddle");

/* =========================================================
   PLAYER POSITION
========================================================= */

let playerX = 0;
let playerY = 0;

let targetPlayerX = 0;
let targetPlayerY = 0;

let hockeyControlsActive = false;

/* =========================================================
   GET TABLE DIMENSIONS
========================================================= */

function getHockeyTableBounds() {
  if (!hockeyTable) return null;

  return hockeyTable.getBoundingClientRect();
}

/* =========================================================
   RESET PLAYER POSITION
========================================================= */

function resetPlayerPosition() {
  if (!hockeyTable || !playerPaddle) return;

  const tableWidth = hockeyTable.clientWidth;
  const tableHeight = hockeyTable.clientHeight;

  // Start in centre of player's half
  playerX = tableWidth / 2;
  playerY = tableHeight * 0.78;

  targetPlayerX = playerX;
  targetPlayerY = playerY;

  updatePlayerPaddle();
}

/* =========================================================
   UPDATE PADDLE VISUAL POSITION
========================================================= */

function updatePlayerPaddle() {
  if (!playerPaddle) return;

  playerPaddle.style.left = `${playerX}px`;
  playerPaddle.style.top = `${playerY}px`;
}

/* =========================================================
   SET PLAYER TARGET
========================================================= */

function setPlayerTarget(clientX, clientY) {
  if (!hockeyTable || !playerPaddle) return;

  const tableBounds = getHockeyTableBounds();

  if (!tableBounds) return;

  /*
   * Convert screen coordinates into coordinates
   * relative to the hockey table.
   */

  let x = clientX - tableBounds.left;
  let y = clientY - tableBounds.top;

  /*
   * Get paddle radius dynamically.
   *
   * This means if we make the paddle larger using CSS,
   * the movement boundaries still work.
   */

  const paddleRadius = playerPaddle.offsetWidth / 2;

  /* =============================================
     HORIZONTAL BOUNDARIES
  ============================================= */

  const minimumX = paddleRadius;
  const maximumX = hockeyTable.clientWidth - paddleRadius;

  x = Math.max(minimumX, Math.min(x, maximumX));

  /* =============================================
     VERTICAL BOUNDARIES
  ============================================= */

  /*
   * Player is only allowed in the bottom half.
   *
   * The paddle radius is added to the centre
   * line so the paddle itself cannot cross it.
   */

  const centreLine = hockeyTable.clientHeight / 2;

  const minimumY = centreLine + paddleRadius;

  const maximumY = hockeyTable.clientHeight - paddleRadius;

  y = Math.max(minimumY, Math.min(y, maximumY));

  targetPlayerX = x;
  targetPlayerY = y;
}

/* =========================================================
   MOUSE CONTROLS
========================================================= */

hockeyTable?.addEventListener("mouseenter", () => {
  hockeyControlsActive = true;
});

hockeyTable?.addEventListener("mouseleave", () => {
  hockeyControlsActive = false;
});

hockeyTable?.addEventListener("mousemove", (event) => {
  if (!hockeyControlsActive) return;

  setPlayerTarget(event.clientX, event.clientY);
});

/* =========================================================
   TOUCH CONTROLS
========================================================= */

hockeyTable?.addEventListener(
  "touchstart",
  (event) => {
    hockeyControlsActive = true;

    const touch = event.touches[0];

    if (!touch) return;

    setPlayerTarget(touch.clientX, touch.clientY);
  },
  {
    passive: true,
  },
);

hockeyTable?.addEventListener(
  "touchmove",
  (event) => {
    const touch = event.touches[0];

    if (!touch) return;

    setPlayerTarget(touch.clientX, touch.clientY);
  },
  {
    passive: true,
  },
);

hockeyTable?.addEventListener("touchend", () => {
  hockeyControlsActive = false;
});

/* =========================================================
   PLAYER MOVEMENT LOOP
========================================================= */

function updatePlayerMovement() {
  const movementSpeed = 0.32;

  /*
   * Remember previous position.
   */

  previousPlayerX = playerX;
  previousPlayerY = playerY;

  /* =============================================
     MOVE PLAYER
  ============================================= */

  playerX += (targetPlayerX - playerX) * movementSpeed;

  playerY += (targetPlayerY - playerY) * movementSpeed;

  /* =============================================
     CALCULATE VELOCITY
  ============================================= */

  playerVelocityX = playerX - previousPlayerX;

  playerVelocityY = playerY - previousPlayerY;

  updatePlayerPaddle();

  requestAnimationFrame(updatePlayerMovement);
}
/* =========================================================
   PLAYER VELOCITY
========================================================= */

/*
 * We need to know how quickly the player's paddle
 * is moving.
 *
 * This lets fast paddle movements hit the puck harder.
 */

let previousPlayerX = 0;
let previousPlayerY = 0;

let playerVelocityX = 0;
let playerVelocityY = 0;
/* =========================================================
   INITIALISE
========================================================= */

// resetPlayerPosition();

updatePlayerMovement();

/* =========================================================
   STEP 2D - CPU / MATCH STATE
========================================================= */

const cpuPaddle = document.getElementById("cpu-paddle");

const playerScoreElement = document.getElementById("player-score");

const cpuScoreElement = document.getElementById("cpu-score");

const hockeyStatusText = document.getElementById("hockey-status-text");

let cpuX = 0;
let cpuY = 0;

let previousCpuX = 0;
let previousCpuY = 0;

let cpuVelocityX = 0;
let cpuVelocityY = 0;

let playerScore = 0;
let cpuScore = 0;

const winningScore = 7;

let matchRunning = false;
let puckInPlay = false;
let matchOver = false;

function resetCpuPosition() {
  if (!hockeyTable || !cpuPaddle) return;

  cpuX = hockeyTable.clientWidth / 2;

  cpuY = hockeyTable.clientHeight * 0.22;

  previousCpuX = cpuX;
  previousCpuY = cpuY;

  cpuVelocityX = 0;
  cpuVelocityY = 0;

  updateCpuPosition();
}

function updateCpuPosition() {
  if (!cpuPaddle) return;

  cpuPaddle.style.left = `${cpuX}px`;

  cpuPaddle.style.top = `${cpuY}px`;
}

/* =========================================================
   CPU AI
========================================================= */

function updateCpuMovement() {
  if (!hockeyTable || !cpuPaddle) {
    requestAnimationFrame(updateCpuMovement);

    return;
  }

  const width = hockeyTable.clientWidth;

  const height = hockeyTable.clientHeight;

  const centreLine = height / 2;

  const radius = cpuPaddle.offsetWidth / 2;

  /* =============================================
     CPU HOME POSITION
  ============================================= */

  let targetX = width / 2;

  let targetY = height * 0.22;

  /* =============================================
     PUCK IS ON CPU SIDE
  ============================================= */

  if (puckInPlay && puckY < centreLine) {
    /*
     * Follow puck horizontally.
     */

    targetX = puckX;

    /*
     * Don't chase all the way to centre immediately.
     */

    targetY = Math.min(puckY, centreLine - radius - 10);
  }

  /* =============================================
     CPU MOVEMENT SPEED
  ============================================= */

  const cpuSpeed = 0.075;

  previousCpuX = cpuX;
  previousCpuY = cpuY;

  cpuX += (targetX - cpuX) * cpuSpeed;

  cpuY += (targetY - cpuY) * cpuSpeed;

  /* =============================================
     KEEP CPU INSIDE TABLE
  ============================================= */

  cpuX = Math.max(radius, Math.min(cpuX, width - radius));

  cpuY = Math.max(radius, Math.min(cpuY, centreLine - radius));

  /* =============================================
     CPU VELOCITY
  ============================================= */

  cpuVelocityX = cpuX - previousCpuX;

  cpuVelocityY = cpuY - previousCpuY;

  updateCpuPosition();

  requestAnimationFrame(updateCpuMovement);
}

updateCpuMovement();

/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener("resize", () => {
  resetPlayerPosition();
});

// ===========================================================================================

/* =========================================================
   AIR HOCKEY
   STEP 2C - PUCK PHYSICS
========================================================= */

const hockeyPuck = document.getElementById("hockey-puck");

/* =========================================================
   PUCK STATE
========================================================= */

let puckX = 0;
let puckY = 0;

let puckVelocityX = 0;
let puckVelocityY = 0;

/*
 * Physics settings
 */

const puckFriction = 0.998;

const puckMaxSpeed = 16;

const puckMinSpeed = 0.02;

/* =========================================================
   GENERIC PADDLE COLLISION
========================================================= */

function handlePaddlePuckCollision(
  paddleX,
  paddleY,
  paddleVelocityX,
  paddleVelocityY,
  paddleElement,
) {
  if (!paddleElement || !hockeyPuck) {
    return;
  }

  const dx = puckX - paddleX;

  const dy = puckY - paddleY;

  const distance = Math.hypot(dx, dy);

  const paddleRadius = paddleElement.offsetWidth / 2;

  const puckRadius = hockeyPuck.offsetWidth / 2;

  const minimumDistance = paddleRadius + puckRadius;

  if (distance >= minimumDistance || distance === 0) {
    return;
  }

  /* COLLISION NORMAL */

  const normalX = dx / distance;

  const normalY = dy / distance;

  /* REMOVE OVERLAP */

  const overlap = minimumDistance - distance;

  puckX += normalX * overlap;

  puckY += normalY * overlap;

  /* RELATIVE VELOCITY */

  const paddleImpact = paddleVelocityX * normalX + paddleVelocityY * normalY;

  const puckImpact = puckVelocityX * normalX + puckVelocityY * normalY;

  const relativeImpact = paddleImpact - puckImpact;

  if (relativeImpact > 0) {
    const bounceStrength = 1.65;

    puckVelocityX += normalX * relativeImpact * bounceStrength;

    puckVelocityY += normalY * relativeImpact * bounceStrength;
  }

  /*
   * Minimum bounce so a stationary paddle
   * can still deflect the puck.
   */

  const speed = Math.hypot(puckVelocityX, puckVelocityY);

  if (speed < 4) {
    puckVelocityX += normalX * 4;

    puckVelocityY += normalY * 4;
  }

  limitPuckSpeed();
}

/* =========================================================
   RESET PUCK
========================================================= */

function resetPuck() {
  if (!hockeyTable || !hockeyPuck) return;

  puckX = hockeyTable.clientWidth / 2;
  puckY = hockeyTable.clientHeight / 2;

  puckVelocityX = 0;
  puckVelocityY = 0;

  updatePuckPosition();
}

/* =========================================================
   POSITION PUCK
========================================================= */

function updatePuckPosition() {
  if (!hockeyPuck) return;

  hockeyPuck.style.left = `${puckX}px`;
  hockeyPuck.style.top = `${puckY}px`;
}

/* =========================================================
   START / SERVE PUCK
========================================================= */

function servePuck() {
  /*
   * Random horizontal direction.
   */

  const horizontalDirection = Math.random() > 0.5 ? 1 : -1;

  /*
   * Randomly serve towards either player.
   */

  const verticalDirection = Math.random() > 0.5 ? 1 : -1;

  puckVelocityX = horizontalDirection * (2 + Math.random() * 2);

  puckVelocityY = verticalDirection * (4 + Math.random() * 2);
}

/* =========================================================
   WALL COLLISIONS
========================================================= */

function handlePuckWallCollisions() {
  if (!hockeyTable || !hockeyPuck || !puckInPlay) {
    return;
  }

  const radius = hockeyPuck.offsetWidth / 2;

  const width = hockeyTable.clientWidth;

  const height = hockeyTable.clientHeight;

  /* =============================================
     GOAL DIMENSIONS
  ============================================= */

  /*
   * Matches approximately the 42% CSS goal width.
   */

  const goalWidth = width * 0.42;

  const goalLeft = (width - goalWidth) / 2;

  const goalRight = goalLeft + goalWidth;

  const insideGoal = puckX > goalLeft + radius && puckX < goalRight - radius;

  /* =============================================
     LEFT WALL
  ============================================= */

  if (puckX - radius <= 0) {
    puckX = radius;

    puckVelocityX = Math.abs(puckVelocityX);
  }

  /* =============================================
     RIGHT WALL
  ============================================= */

  if (puckX + radius >= width) {
    puckX = width - radius;

    puckVelocityX = -Math.abs(puckVelocityX);
  }

  /* =============================================
     TOP
  ============================================= */

  if (puckY - radius <= 0) {
    if (insideGoal) {
      /*
       * Player scored in CPU goal.
       */

      scoreGoal("player");

      return;
    }

    /*
     * Hit top wall outside goal.
     */

    puckY = radius;

    puckVelocityY = Math.abs(puckVelocityY);
  }

  /* =============================================
     BOTTOM
  ============================================= */

  if (puckY + radius >= height) {
    if (insideGoal) {
      /*
       * CPU scored.
       */

      scoreGoal("cpu");

      return;
    }

    puckY = height - radius;

    puckVelocityY = -Math.abs(puckVelocityY);
  }
}
/* =========================================================
   PLAYER → PUCK COLLISION
========================================================= */

function handlePlayerPuckCollision() {
  if (!playerPaddle || !hockeyPuck) return;

  /*
   * Distance between the centres.
   */

  const dx = puckX - playerX;

  const dy = puckY - playerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  /*
   * Get radius from actual CSS dimensions.
   */

  const paddleRadius = playerPaddle.offsetWidth / 2;

  const puckRadius = hockeyPuck.offsetWidth / 2;

  const minimumDistance = paddleRadius + puckRadius;

  /*
   * No collision.
   */

  if (distance >= minimumDistance || distance === 0) {
    return;
  }

  /* =============================================
     COLLISION NORMAL
  ============================================= */

  /*
   * Direction pointing from paddle
   * towards puck.
   */

  const normalX = dx / distance;

  const normalY = dy / distance;

  /* =============================================
     SEPARATE PUCK FROM PADDLE
  ============================================= */

  /*
   * Prevents the puck getting trapped
   * inside the paddle.
   */

  const overlap = minimumDistance - distance;

  puckX += normalX * overlap;

  puckY += normalY * overlap;

  /* =============================================
     PLAYER IMPACT
  ============================================= */

  /*
   * How quickly the paddle is moving in the
   * direction of the collision.
   */

  const paddleImpact = playerVelocityX * normalX + playerVelocityY * normalY;

  /*
   * Current puck velocity in collision direction.
   */

  const puckImpact = puckVelocityX * normalX + puckVelocityY * normalY;

  /*
   * Only bounce if puck and paddle are
   * moving towards each other.
   */

  const relativeImpact = paddleImpact - puckImpact;

  if (relativeImpact > 0) {
    const bounceStrength = 1.55;

    puckVelocityX += normalX * relativeImpact * bounceStrength;

    puckVelocityY += normalY * relativeImpact * bounceStrength;
  }

  /*
   * Give even slow paddle collisions
   * a minimum amount of energy.
   */

  const currentSpeed = Math.hypot(puckVelocityX, puckVelocityY);

  if (currentSpeed < 4) {
    puckVelocityX += normalX * 4;

    puckVelocityY += normalY * 4;
  }

  limitPuckSpeed();
}

/* =========================================================
   LIMIT PUCK SPEED
========================================================= */

function limitPuckSpeed() {
  const speed = Math.hypot(puckVelocityX, puckVelocityY);

  if (speed <= puckMaxSpeed) return;

  const scale = puckMaxSpeed / speed;

  puckVelocityX *= scale;
  puckVelocityY *= scale;
}

/* =========================================================
   PUCK PHYSICS LOOP
========================================================= */

function updatePuckPhysics() {
  if (!hockeyPuck || !hockeyTable) {
    requestAnimationFrame(updatePuckPhysics);

    return;
  }

  if (puckInPlay) {
    /* MOVE PUCK */

    puckX += puckVelocityX;
    puckY += puckVelocityY;

    /* FRICTION */

    puckVelocityX *= puckFriction;
    puckVelocityY *= puckFriction;

    /* REMOVE TINY VELOCITIES */

    if (Math.abs(puckVelocityX) < puckMinSpeed) {
      puckVelocityX = 0;
    }

    if (Math.abs(puckVelocityY) < puckMinSpeed) {
      puckVelocityY = 0;
    }

    /* WALL / GOAL COLLISION */

    handlePuckWallCollisions();

    /* PLAYER COLLISION */

    handlePaddlePuckCollision(
      playerX,
      playerY,
      playerVelocityX,
      playerVelocityY,
      playerPaddle,
    );

    /* CPU COLLISION */

    handlePaddlePuckCollision(
      cpuX,
      cpuY,
      cpuVelocityX,
      cpuVelocityY,
      cpuPaddle,
    );

    limitPuckSpeed();
  }

  updatePuckPosition();

  requestAnimationFrame(updatePuckPhysics);
}

/* =========================================================
   START PHYSICS
========================================================= */

updatePuckPhysics();

/* =========================================================
   RESTART MATCH
========================================================= */

const restartHockey = document.getElementById("restart-hockey");
restartHockey?.addEventListener("click", () => {
  resetPlayerPosition();

  resetPuck();

  setTimeout(() => {
    servePuck();
  }, 500);

  function servePuck() {
    puckInPlay = true;

    const horizontalDirection = Math.random() > 0.5 ? 1 : -1;

    const verticalDirection = Math.random() > 0.5 ? 1 : -1;

    puckVelocityX = horizontalDirection * (2 + Math.random() * 2);

    puckVelocityY = verticalDirection * (4 + Math.random() * 2);
  }
});

/* =========================================================
   SCOREBOARD
========================================================= */

function updateScoreboard() {
  if (playerScoreElement) {
    playerScoreElement.textContent = playerScore;
  }

  if (cpuScoreElement) {
    cpuScoreElement.textContent = cpuScore;
  }
}

/* =========================================================
   STATUS
========================================================= */

function setHockeyStatus(message) {
  if (!hockeyStatusText) return;

  hockeyStatusText.textContent = message;
}

/* =========================================================
   GOAL
========================================================= */

function scoreGoal(scorer) {
  if (!puckInPlay) return;

  puckInPlay = false;

  puckVelocityX = 0;
  puckVelocityY = 0;

  if (scorer === "player") {
    playerScore++;

    setHockeyStatus("GOAL — YOU");
  } else {
    cpuScore++;

    setHockeyStatus("GOAL — CPU");
  }

  updateScoreboard();

  /* CHECK WINNER */

  if (playerScore >= winningScore || cpuScore >= winningScore) {
    endHockeyMatch();

    return;
  }

  /* RESET ROUND */

  setTimeout(() => {
    resetPlayerPosition();

    resetCpuPosition();

    resetPuck();

    setHockeyStatus("READY");

    setTimeout(() => {
      servePuck();
    }, 700);
  }, 900);
}

/* =========================================================
   GAME OVER
========================================================= */

function endHockeyMatch() {
  matchOver = true;

  matchRunning = false;

  puckInPlay = false;

  puckVelocityX = 0;
  puckVelocityY = 0;

  if (playerScore >= winningScore) {
    setHockeyStatus("YOU WIN");
  } else {
    setHockeyStatus("CPU WINS");
  }
}

/* =========================================================
   RESET MATCH
========================================================= */

function resetHockeyMatch() {
  playerScore = 0;
  cpuScore = 0;

  matchOver = false;
  matchRunning = false;
  puckInPlay = false;

  updateScoreboard();

  resetPlayerPosition();

  resetCpuPosition();

  resetPuck();

  setHockeyStatus("READY");
}
