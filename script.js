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
      const targetWindow = document.getElementById(windowId);
      const taskbarApp = document.getElementById(taskbarId);

      if (!targetWindow || !taskbarApp) return;

      targetWindow.classList.add("active-window");
      taskbarApp.classList.add("active-taskbar-app");

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
    button.addEventListener("click", () => {
      const appWindow = button.closest(".app-window");
      if (!appWindow) return;

      const windowId = appWindow.id;
      appWindow.classList.remove("active-window");

      const matchingIcon = document.querySelector(
        `[data-window="${windowId}"]`,
      );
      if (!matchingIcon) return;

      const taskbarId = matchingIcon.dataset.taskbar;
      const taskbarApp = document.getElementById(taskbarId);
      if (taskbarApp) {
        taskbarApp.classList.remove("active-taskbar-app");
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

  const windows = document.querySelectorAll(".app-window");
  windows.forEach((windowEl) => {
    const header = windowEl.querySelector(".window-header");
    if (!header) return;

    let isDraggingWindow = false;
    let windowOffsetX = 0;
    let windowOffsetY = 0;

    header.addEventListener("mousedown", (e) => {
      isDraggingWindow = true;
      windowOffsetX = e.clientX - windowEl.offsetLeft;
      windowOffsetY = e.clientY - windowEl.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDraggingWindow) return;
      windowEl.style.left = `${e.clientX - windowOffsetX}px`;
      windowEl.style.top = `${e.clientY - windowOffsetY}px`;
    });

    document.addEventListener("mouseup", () => {
      isDraggingWindow = false;
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
