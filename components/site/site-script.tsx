// Small progressive-enhancement script. The page is fully readable without it:
// it only adds reveal-on-scroll, pauses off-screen animations, highlights the
// current section in the nav and drives the "real work" connection matrix.
const script = `
(function () {
  var d = document;
  var root = d.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = d.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
    if (window.scrollY < 300) {
      d.querySelectorAll(".desktop-nav a[aria-current]").forEach(function (a) { a.removeAttribute("aria-current"); });
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var reveals = d.querySelectorAll(".reveal");
  var anims = d.querySelectorAll("[data-anim]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { revealObserver.observe(el); });

    var playObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-playing", entry.isIntersecting);
      });
    });
    anims.forEach(function (el) { playObserver.observe(el); });

    var links = {};
    d.querySelectorAll('.desktop-nav a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        link.setAttribute("aria-current", "location");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(links).forEach(function (id) {
      var section = d.getElementById(id);
      if (section) navObserver.observe(section);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    anims.forEach(function (el) { el.classList.add("is-playing"); });
  }

  d.querySelectorAll(".mobile-nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      var menu = a.closest("details");
      if (menu) menu.open = false;
    });
  });
  d.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var menu = d.querySelector(".mobile-nav[open]");
    if (!menu) return;
    menu.open = false;
    var summary = menu.querySelector("summary");
    if (summary) summary.focus();
  });

  var STORE = "operum-motion";
  var paused = false;
  try { paused = window.localStorage.getItem(STORE) === "paused"; } catch (e) { paused = false; }
  var toggles = d.querySelectorAll("[data-motion-toggle]");
  function applyMotion() {
    root.classList.toggle("motion-paused", paused);
    toggles.forEach(function (btn) { btn.setAttribute("aria-pressed", paused ? "true" : "false"); });
  }
  applyMotion();
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      paused = !paused;
      try { window.localStorage.setItem(STORE, paused ? "paused" : "playing"); } catch (e) { /* storage unavailable */ }
      applyMotion();
    });
  });

  var matrix = d.querySelector("[data-rw]");
  if (matrix) {
    var rows = matrix.querySelectorAll("[data-env-row]");
    var current = 0;
    var hovering = false;
    var setFocus = function (n) { matrix.setAttribute("data-focus", String(n)); };
    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        hovering = true;
        current = Number(row.getAttribute("data-env-row"));
        setFocus(current);
      });
      row.addEventListener("mouseleave", function () { hovering = false; });
    });
    setFocus(0);
    window.setInterval(function () {
        if (paused || hovering || !matrix.classList.contains("is-playing")) return;
        current = (current + 1) % rows.length;
        setFocus(current);
      }, reduce ? 4200 : 2600);
  }
})();
`;

export function SiteScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
