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

function isBrowserFullscreen() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

async function toggleFullscreen() {
  const target = isBrowserFullscreen() ? document : document.documentElement;
  const action = target === document
    ? target.exitFullscreen ?? target.webkitExitFullscreen
    : target.requestFullscreen ?? target.webkitRequestFullscreen;
  if (!action) return false;

  try {
    await action.call(target);
    return true;
  } catch {
    return false;
  }
}

// Keep controls usable when the browser blocks access to saved preferences.
const settingsStore = {
  getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // The current page can still apply the preference.
    }
  },
  removeItem(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // There is no accessible saved value to clear.
    }
  },
};

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

  const desktop = document.querySelector(".os-desktop");
  const desktopIcons = document.querySelectorAll(".desktop-item");

  function placeDesktopIcon(icon, left, top) {
    const bounds = desktop.getBoundingClientRect();
    const dock = document.querySelector(".task-bar")?.getBoundingClientRect();
    const position = icon.getBoundingClientRect();
    const originX = position.left - (parseFloat(icon.style.left) || 0);
    const originY = position.top - (parseFloat(icon.style.top) || 0);
    const x = Math.max(bounds.left, Math.min(left, bounds.right - position.width));
    let bottom = Math.min(bounds.bottom, window.innerHeight);

    if (dock && x < dock.right && x + position.width > dock.left) {
      bottom = Math.min(bottom, dock.top);
    }

    const y = Math.max(bounds.top, Math.min(top, bottom - position.height));
    icon.classList.add("is-positioned");
    icon.style.left = `${x - originX}px`;
    icon.style.top = `${y - originY}px`;
  }

  desktopIcons.forEach((icon) => {
    let drag;
    let moved = false;

    icon.addEventListener("dragstart", (event) => event.preventDefault());
    icon.addEventListener("pointerdown", (event) => {
      moved = false;
      if (!desktop || !event.isPrimary || event.button !== 0 ||
          document.body.classList.contains("icons-locked")) return;

      const bounds = icon.getBoundingClientRect();
      icon.setPointerCapture(event.pointerId);
      drag = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: bounds.left,
        top: bounds.top,
      };
    });

    icon.addEventListener("pointermove", (event) => {
      if (drag?.id !== event.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!moved && Math.hypot(dx, dy) < 6) return;

      if (!moved) {
        moved = true;
        icon.classList.add("dragging");
      }

      placeDesktopIcon(icon, drag.left + dx, drag.top + dy);
    });

    function finishDrag(event) {
      if (drag?.id !== event.pointerId) return;
      drag = undefined;
      icon.classList.remove("dragging");
    }

    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    icon.addEventListener("lostpointercapture", finishDrag);

    icon.addEventListener("click", (event) => {
      if (!moved || event.detail === 0) return;
      event.stopImmediatePropagation();
    }, true);

    icon.addEventListener("dblclick", (event) => {
      if (moved) event.stopImmediatePropagation();
    }, true);

    icon.addEventListener("pointerup", (event) => {
      if (moved) event.stopImmediatePropagation();
      finishDrag(event);
    });
  });

  window.addEventListener("resize", () => {
    desktopIcons.forEach((icon) => {
      if (!icon.classList.contains("is-positioned")) return;
      const bounds = icon.getBoundingClientRect();
      placeDesktopIcon(icon, bounds.left, bounds.top);
    });
  });

  desktopIcons.forEach((icon) => {
    const openIcon = () => {
      const windowId = icon.dataset.window;
      const taskbarId = icon.dataset.taskbar;

      if (!windowId) return;

      const targetWindow = document.getElementById(windowId);

      if (!targetWindow) {
        console.error(`Window not found: ${windowId}`);
        return;
      }

      openAppWindow(targetWindow, windowTaskbars.get(windowId) ?? taskbarId);
    };
    if (icon.id === "arcade-icon") {
      icon.addEventListener("click", openIcon);
      return;
    }

    icon.addEventListener("dblclick", openIcon);
    icon.addEventListener("pointerup", (event) => {
      if (event.pointerType === "touch") openIcon();
    });
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const sendButton = contactForm.querySelector(".send-btn");
    const status = document.getElementById("contact-status");

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sendButton.disabled) return;

      const mail = window.emailjs;
      if (!mail?.sendForm) {
        status.textContent = "The sending service did not load. Reload to retry or email me directly.";
        return;
      }

      sendButton.disabled = true;
      sendButton.textContent = "Sending…";
      status.textContent = "";

      try {
        await mail.sendForm("service_2ck1wkw", "template_x9em24t", contactForm, {
          publicKey: "U5rZmh31ECmnHaw2K",
        });
        contactForm.reset();
        status.textContent = "Message sent.";
      } catch {
        status.textContent = "Your message could not be sent. Try again or email me directly.";
      } finally {
        sendButton.disabled = false;
        sendButton.textContent = "Send Message";
      }
    });
  }

  const closeButtons = document.querySelectorAll(".close-btn");

  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const appWindow = button.closest(".app-window");

      if (!appWindow) return;

      closeAppWindow(appWindow);
    });
  });

  const profileCard = document.querySelector(".user-profile-card");
  if (profileCard) {
    profileCard.addEventListener("click", () => {
      const windowId = profileCard.dataset.window;
      const targetWindow = document.getElementById(windowId);
      if (targetWindow) {
        openAppWindow(targetWindow, profileCard.dataset.taskbar);
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

  const cvWindow = document.getElementById("system-window");
  const cvScroller = cvWindow?.querySelector(".cv-content");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cvMotion;

  function syncCvMotion() {
    cvMotion?.revert();
    cvMotion = undefined;

    const { gsap, ScrollTrigger } = window;
    if (!cvScroller || !cvWindow.classList.contains("active-window") ||
        reducedMotion.matches || document.body.classList.contains("performance-mode") ||
        !gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    cvMotion = gsap.context(() => {
      gsap.from(".cv-hero", { y: 10, opacity: 0.75, duration: 0.4, ease: "power2.out" });
      cvScroller.querySelectorAll("[data-cv-reveal]").forEach((section) => {
        gsap.from(section, {
          y: 14,
          opacity: 0.7,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            scroller: cvScroller,
            start: "top 92%",
            once: true,
          },
        });
      });
    }, cvScroller);
  }

  reducedMotion.addEventListener("change", syncCvMotion);

  function openAppWindow(windowEl, taskbarId = null) {
    if (!windowEl) return;

    windowEl.classList.add("active-window");
    bringWindowToFront(windowEl);
    if (windowEl === cvWindow) syncCvMotion();
    if (uiSoundToggle?.checked) playUiSound(520);

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
    windowEl.classList.remove("window-focused", "is-dragging");
    if (windowEl.id === "arcade-window") showArcadeHome();
    if (windowEl === cvWindow) syncCvMotion();
    if (windowEl.id === "archive-window") {
      windowEl.querySelectorAll("audio").forEach((audio) => audio.pause());
    }

    const windowId = windowEl.id;

    const taskbarId = windowTaskbars.get(windowId);
    if (!taskbarId) return;

    const hasOpenWindow = [...windowTaskbars].some(([id, taskbar]) =>
      taskbar === taskbarId &&
      document.getElementById(id)?.classList.contains("active-window"),
    );
    document.getElementById(taskbarId)?.classList.toggle("active-taskbar-app", hasOpenWindow);
  }

  const windowTaskbars = new Map(
    [...document.querySelectorAll("[data-window][data-taskbar]")].map(
      ({ dataset }) => [dataset.window, dataset.taskbar],
    ),
  );

  for (const [windowId, taskbarId] of [
    ["email-window", "email-taskbar"],
    ["settings-window", "settings-taskbar"],
    ["finder-window", "finder-taskbar"],
    ["music-window", "music-taskbar"],
    ["archive-window", "archive-taskbar"],
    ["trash-window", "trash-taskbar"],
  ]) {
    windowTaskbars.set(windowId, taskbarId);
    document.getElementById(taskbarId)?.addEventListener("click", () => {
      openAppWindow(document.getElementById(windowId), taskbarId);
    });
  }

  document.querySelectorAll(".pinned-app[data-window]").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.window;
      openAppWindow(document.getElementById(id), windowTaskbars.get(id));
      startMenu?.classList.remove("active");
    });
  });

  document.querySelectorAll(".app-window .minimize-btn").forEach((button) => {
    button.addEventListener("click", () => closeAppWindow(button.closest(".app-window")));
  });

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
      if (windowEl.classList.contains("fullscreen")) return;
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

      const navbarBottom = document.querySelector(".system-navbar")?.getBoundingClientRect().bottom ?? 0;
      newY = Math.max(navbarBottom, Math.min(newY, maxY));

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

  const wallpaperOptions = [...document.querySelectorAll(".wallpaper-option")];

  function applyWallpaper(selected) {
    document.body.style.setProperty("--wallpaper", `url("${selected.dataset.wallpaper}")`);
    wallpaperOptions.forEach((option) => {
      option.classList.toggle("active-wallpaper", option === selected);
      option.setAttribute("aria-pressed", option === selected);
    });
  }

  const savedWallpaper = settingsStore.getItem("wallpaper");
  const initialWallpaper = wallpaperOptions.find(
    (option) => option.dataset.wallpaper === savedWallpaper,
  ) ?? wallpaperOptions[0];
  if (initialWallpaper) applyWallpaper(initialWallpaper);

  wallpaperOptions.forEach((option) => {
    option.addEventListener("click", () => {
      applyWallpaper(option);
      settingsStore.setItem("wallpaper", option.dataset.wallpaper);
    });
  });

  const musicTabs = document.querySelectorAll("[data-music-tab]");
  const musicSections = document.querySelectorAll("#music-window .music-section");
  musicTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      musicTabs.forEach((button) => button.setAttribute("aria-pressed", button === tab));
      musicSections.forEach((section) => {
        section.classList.toggle("active-section", section.id === tab.dataset.musicTab);
      });
    });
  });

  const archiveTabs = document.querySelectorAll("[data-archive-tab]");
  archiveTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      archiveTabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-pressed", selected);
        const panel = document.getElementById(item.dataset.archiveTab);
        if (!panel) return;
        panel.hidden = !selected;
        if (panel.hidden) panel.querySelectorAll("audio").forEach((audio) => audio.pause());
      });
    });
  });

  const workFilters = document.querySelectorAll("[data-work-filter]");
  const workEntries = document.querySelectorAll("[data-work-category]");
  const workEmpty = document.querySelector(".work-empty");

  workFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.workFilter;
      workFilters.forEach((button) => button.setAttribute("aria-pressed", button === filter));
      let hasResults = false;

      workEntries.forEach((entry) => {
        const categories = entry.dataset.workCategory.split(" ");
        entry.hidden = category === "all"
          ? categories.includes("services")
          : !categories.includes(category);
        hasResults ||= !entry.hidden;
      });
      if (workEmpty) workEmpty.hidden = hasResults;
    });
  });

  document.getElementById("work-open-arcade")?.addEventListener("click", () => {
    openAppWindow(document.getElementById("arcade-window"));
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
  settingsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      settingsTabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-pressed", selected);
        document.getElementById(item.dataset.tab)?.classList.toggle("active-section", selected);
      });
    });
  });

  const settingsToggles = [
    ["themeToggle", "theme", "light-mode", "light", "dark"],
    ["glowToggle", "glow", "disable-glow", "false", "true", true],
    ["transparencyToggle", "transparency", "reduce-transparency", "true", "false"],
    ["lockIconsToggle", "lockIcons", "icons-locked", "true", "false"],
    ["navbarToggle", "navbar", "auto-hide-navbar", "false", "true"],
    ["performanceToggle", "performance", "performance-mode", "true", "false"],
    ["videoToggle", "videosDisabled", null, "true", "false"],
  ];

  for (const [id, key, bodyClass, on, off, inverted = false] of settingsToggles) {
    const toggle = document.getElementById(id);
    if (!toggle) continue;
    const saved = settingsStore.getItem(key);
    if (saved !== null) toggle.checked = saved === on;

    const apply = () => {
      if (bodyClass) document.body.classList.toggle(bodyClass, toggle.checked !== inverted);
      if (id === "performanceToggle") syncCvMotion();
    };

    apply();
    toggle.addEventListener("change", () => {
      settingsStore.setItem(key, toggle.checked ? on : off);
      apply();
    });
  }

  const uiSoundToggle = document.getElementById("uiSoundToggle");
  const startupSoundToggle = document.getElementById("startupSoundToggle");
  let audioContext;

  function playUiSound(frequency) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContext ??= new AudioContext();
    audioContext.resume().then(() => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.16);
    }).catch(() => {});
  }

  for (const toggle of [uiSoundToggle, startupSoundToggle]) {
    if (!toggle) continue;
    toggle.checked = settingsStore.getItem(toggle.id) === "true";
    toggle.addEventListener("change", () => {
      settingsStore.setItem(toggle.id, toggle.checked);
      if (toggle.checked) playUiSound(toggle === startupSoundToggle ? 660 : 520);
    });
  }

  window.addEventListener("click", () => {
    if (startupSoundToggle?.checked) playUiSound(660);
  }, { once: true, capture: true });

  const fullscreenButton = document.getElementById("settings-fullscreen");
  const fullscreenStatus = document.getElementById("fullscreen-status");

  const syncFullscreenLabel = () => {
    if (fullscreenButton) {
      fullscreenButton.textContent = isBrowserFullscreen() ? "Exit fullscreen" : "Enter fullscreen";
    }
  };
  syncFullscreenLabel();
  document.addEventListener("fullscreenchange", syncFullscreenLabel);
  document.addEventListener("webkitfullscreenchange", syncFullscreenLabel);

  const toggleBrowserFullscreen = async () => {
    const changed = await toggleFullscreen();
    if (fullscreenStatus) {
      fullscreenStatus.textContent = changed ? "" : "Fullscreen is unavailable in this browser or view.";
    }
    syncFullscreenLabel();
  };
  fullscreenButton?.addEventListener("click", toggleBrowserFullscreen);
  document.getElementById("fullscreen-toggle")?.addEventListener("click", toggleBrowserFullscreen);

  document.getElementById("resetOS")?.addEventListener("click", () => {
    for (const key of [...settingsToggles.map(([, key]) => key),
      "wallpaper", "uiSoundToggle", "startupSoundToggle"]) {
      settingsStore.removeItem(key);
    }
    location.reload();
  });
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
        batteryFill.style.background = "currentColor";
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

const arcadeWindow = document.getElementById("arcade-window");

const launchAirHockey = document.getElementById("launch-air-hockey");

const arcadeBackBtn = document.getElementById("arcade-back-btn");

const arcadeHome = arcadeWindow?.querySelector(".arcade-home");

const hockeyScreen = document.getElementById("hockey-screen");

launchAirHockey?.addEventListener("click", () => {
  arcadeHome.classList.remove("active-arcade-screen");

  hockeyScreen.classList.add("active-arcade-screen");

  resetHockeyMatch();
});

arcadeBackBtn?.addEventListener("click", () => {
  showArcadeHome();
});

function showArcadeHome() {
  clearTimeout(hockeyRoundTimer);
  cancelAnimationFrame(hockeyFrame);
  puckInPlay = false;
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

let hockeyRoundTimer;
let hockeyFrame;
let puckInPlay = false;


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


}


/* =========================================================
   WINDOW RESIZE
========================================================= */

const hockeyResizeObserver = new ResizeObserver(() => {
  if (hockeyTable.clientWidth && hockeyScreen?.classList.contains("active-arcade-screen") &&
      playerScore < winningScore && cpuScore < winningScore) {
    startHockeyRound();
  }
});
if (hockeyTable) hockeyResizeObserver.observe(hockeyTable);

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
  puckInPlay = true;
  setHockeyStatus("PLAY");
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
    if (!puckInPlay) return;

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

}

const restartHockey = document.getElementById("restart-hockey");
restartHockey?.addEventListener("click", resetHockeyMatch);

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

  hockeyRoundTimer = setTimeout(startHockeyRound, 900);
}

/* =========================================================
   GAME OVER
========================================================= */

function endHockeyMatch() {
  cancelAnimationFrame(hockeyFrame);

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

  updateScoreboard();
  startHockeyRound();
}

function startHockeyRound() {
  clearTimeout(hockeyRoundTimer);
  cancelAnimationFrame(hockeyFrame);
  resetPlayerPosition();
  resetCpuPosition();
  puckInPlay = false;
  resetPuck();
  setHockeyStatus("READY");
  hockeyRoundTimer = setTimeout(servePuck, 700);

  const frameDuration = 1000 / 60;
  let lastFrame;
  let elapsed = 0;

  function tick(time) {
    elapsed += Math.min(time - (lastFrame ?? time), 50);
    lastFrame = time;
    hockeyFrame = requestAnimationFrame(tick);
    while (elapsed >= frameDuration) {
      updatePlayerMovement();
      updateCpuMovement();
      updatePuckPhysics();
      elapsed -= frameDuration;
    }
  }

  hockeyFrame = requestAnimationFrame(tick);
}
