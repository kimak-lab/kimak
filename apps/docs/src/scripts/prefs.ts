import { isFramework, type Framework } from "../lib/nav";

const FRAMEWORK_KEY = "kimak.docs.framework";
const THEME_KEY = "kimak.docs.theme";

function currentFramework(): Framework {
  return isFramework(document.documentElement.dataset.framework)
    ? document.documentElement.dataset.framework
    : "react";
}

function setFramework(framework: Framework) {
  document.documentElement.dataset.framework = framework;
  localStorage.setItem(FRAMEWORK_KEY, framework);
  syncFrameworkButtons();
}

function setTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
  syncThemeButton();
}

function syncFrameworkButtons() {
  const current = currentFramework();
  document.querySelectorAll("[data-set-framework]").forEach((el) => {
    el.setAttribute("aria-pressed", String(el.getAttribute("data-set-framework") === current));
  });
}

function syncThemeButton() {
  const dark = document.documentElement.classList.contains("dark");
  document.querySelectorAll("[data-toggle-theme]").forEach((el) => {
    el.setAttribute("aria-pressed", String(dark));
    el.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  });
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const frameworkButton = target.closest("[data-set-framework]");
  if (frameworkButton) {
    const next = frameworkButton.getAttribute("data-set-framework");
    if (isFramework(next)) setFramework(next);
    return;
  }

  const themeButton = target.closest("[data-toggle-theme]");
  if (themeButton) {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    setTheme(next);
  }
});

syncFrameworkButtons();
syncThemeButton();
