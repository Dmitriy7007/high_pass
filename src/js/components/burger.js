const burger = document?.querySelector(".burger");
const nav = document?.querySelector(".header-nav");
const navItems = document?.querySelectorAll(".header-nav__link");
const body = document.body;
const header = document?.querySelector(".header");
const headerHeight = header.offsetHeight;
console.log(headerHeight);
document
  .querySelector(":root")
  .style.setProperty("--header-height", `${headerHeight}px`);

burger?.addEventListener("click", () => {
  body.classList.toggle("stop-scroll");
  burger?.classList.toggle("burger--active");
  nav?.classList.toggle("nav--visible");
});

navItems.forEach((el) => {
  el.addEventListener("click", () => {
    body.classList.remove("stop-scroll");
    burger?.classList.remove("burger--active");
    nav?.classList.remove("nav--visible");
  });
});

document.addEventListener("click", (ev) => {
  if (!(ev.target.closest(".header-nav") || ev.target.closest(".burger"))) {
    body.classList.remove("stop-scroll");
    burger?.classList.remove("burger--active");
    nav?.classList.remove("nav--visible");
  }
});
