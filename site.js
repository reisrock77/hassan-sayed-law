const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
  const header = menuButton.closest(".site-header");
  header.classList.add("nav-enhanced");
  menuButton.hidden = false;

  function setMenuOpen(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("open", open);
  }

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") === "false");
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  header.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
}

function openLinkedChecklist() {
  const hash = window.location.hash;
  if (!/^#prep-[a-z]+$/.test(hash)) return;
  const checklist = document.getElementById(hash.slice(1));
  if (checklist instanceof HTMLDetailsElement) checklist.open = true;
}

window.addEventListener("hashchange", openLinkedChecklist);
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    const checklist = document.getElementById(card.hash.slice(1));
    if (checklist instanceof HTMLDetailsElement) checklist.open = true;
  });
});
openLinkedChecklist();

const articleToggle = document.querySelector("[data-article-toggle]");
const extraArticles = document.querySelector("#more-articles");
if (articleToggle && extraArticles) {
  function showExtraArticles(show) {
    extraArticles.hidden = !show;
    articleToggle.setAttribute("aria-expanded", String(show));
    articleToggle.textContent = show ? "عرض مقالات أقل" : "عرض جميع المقالات";
  }

  showExtraArticles(false);
  articleToggle.hidden = false;
  articleToggle.addEventListener("click", () => showExtraArticles(extraArticles.hidden));
}

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".home-page .hero");
const heroPreload = document.querySelector('link[rel="preload"][as="image"]');
if (hero && heroPreload && !motionPreference.matches) {
  const backdrop = new Image();
  backdrop.src = heroPreload.href;
  backdrop.decode().then(() => {
    if (hero.getBoundingClientRect().bottom > 0) hero.classList.add("assemble");
  }).catch(() => {});
}

const portrait = document.querySelector(".about-portrait");
if (portrait && "IntersectionObserver" in window && !motionPreference.matches) {
  const portraitObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    portraitObserver.disconnect();
    portrait.decode().then(() => portrait.classList.add("assemble")).catch(() => {});
  }, { threshold: .12 });
  portraitObserver.observe(portrait);
}

if ("IntersectionObserver" in window && !motionPreference.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (entry.boundingClientRect.top > window.innerHeight * .48) entry.target.classList.add("shown");
      observer.unobserve(entry.target);
    }
  }, { threshold: .16 });
  document.querySelectorAll(".reveal, .reading-card").forEach((element) => observer.observe(element));
}
