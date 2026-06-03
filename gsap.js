window.addEventListener("load", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".expand-media", {
    scale: 1.8,

    borderRadius: 0,

    ease: "none",

    scrollTrigger: {
      trigger: ".expand-section",

      start: "top top",
      end: "+=150%",

      scrub: 1,

      pin: true,
      pinSpacing: true,

      anticipatePin: 1,
    },
  });

  gsap.to(".title-left", {
    xPercent: -200,

    opacity: 0,

    ease: "none",

    scrollTrigger: {
      trigger: ".expand-section",

      start: "top top",
      end: "bottom top",

      scrub: 1,
    },
  });

  gsap.to(".title-right", {
    xPercent: 200,

    opacity: 0,

    ease: "none",

    scrollTrigger: {
      trigger: ".expand-section",

      start: "top top",
      end: "bottom top",

      scrub: 1,
    },
  });

  ScrollTrigger.refresh();

  //   GSAP animation on Network Cards
  gsap.utils.toArray(".network-card").forEach((card, i) => {
    gsap.to(card, {
      y: i % 2 === 0 ? 20 : -20,

      duration: 4 + i,

      repeat: -1,

      yoyo: true,

      ease: "sine.inOut",
    });
  });

  //   GSAP animations for network cards hover effect
  const cards = document.querySelectorAll(".network-card");

  const blobTitle = document.getElementById("blob-title");

  const blobText = document.getElementById("blob-text");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const title = card.dataset.title;

      const description = card.dataset.description;

      gsap.to(".system-blob", {
        opacity: 0.6,

        duration: 0.15,

        onComplete: () => {
          blobTitle.textContent = title;
          blobText.textContent = description;

          gsap.to(".system-blob", {
            opacity: 1,
            duration: 0.3,
          });
        },
      });
    });
  });

  /* =================================
   GOOEY TEXT
================================= */

  const texts = [
    "Frontend",
    "Interfaces",
    "Motion",
    "Music",
    "Creative AI",
    "Visual Systems",
    "Storytelling",
  ];

  const text1 = document.getElementById("text1");
  const text2 = document.getElementById("text2");

  let textIndex = texts.length - 1;

  let morph = 0;
  let cooldown = 0.4;

  const morphTime = 1;
  const cooldownTime = 0.4;

  text1.textContent = texts[textIndex];
  text2.textContent = texts[(textIndex + 1) % texts.length];

  function setMorph(fraction) {
    text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;

    text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;

    text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;

    text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  }

  function doCooldown() {
    morph = 0;

    text2.style.filter = "";
    text2.style.opacity = "100%";

    text1.style.filter = "";
    text1.style.opacity = "0%";
  }

  function doMorph() {
    morph -= cooldown;

    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
      cooldown = cooldownTime;

      fraction = 1;
    }

    setMorph(fraction);
  }

  let lastTime = new Date();

  function animate() {
    requestAnimationFrame(animate);

    const newTime = new Date();

    const dt = (newTime - lastTime) / 1000;

    lastTime = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
      if (cooldown + dt > 0) {
        textIndex++;

        text1.textContent = texts[textIndex % texts.length];

        text2.textContent = texts[(textIndex + 1) % texts.length];
      }

      doMorph();
    } else {
      doCooldown();
    }
  }

  animate();
});

/* =================================
   TEXT REVEAL
================================= */

gsap.to(".reveal-heading", {
  y: 0,

  opacity: 1,

  filter: "blur(0px)",

  duration: 1.4,

  stagger: 0.12,

  ease: "power4.out",

  scrollTrigger: {
    trigger: ".reveal-heading",

    start: "top 85%",
  },
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
    // gap: size.gap,
  });

  foodBook.loadFromHTML(document.querySelectorAll("#food-book .page"));

  // cocktailBook = new St.PageFlip(document.getElementById("cocktail-book"), {
  //   width: size.width,
  //   height: size.height,
  //   size: "fixed",
  //   showCover: true,
  // });

  // cocktailBook.loadFromHTML(document.querySelectorAll("#cocktail-book .page"));
}

function getBookSize() {
  return { width: 600, height: 840 };
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    initFlipbooks();
  }
});


