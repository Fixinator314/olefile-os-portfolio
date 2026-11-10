window.addEventListener("load", () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
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
});
