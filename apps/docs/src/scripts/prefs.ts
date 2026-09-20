import { chromeToggleVariant } from "../lib/chrome";
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

function setNavOpen(open: boolean) {
  const root = document.documentElement;
  if (open) root.dataset.navOpen = "";
  else delete root.dataset.navOpen;
  document.querySelectorAll("[data-toggle-nav]").forEach((el) => {
    el.setAttribute("aria-expanded", String(open));
  });
}

function syncPressed(el: Element, pressed: boolean) {
  el.setAttribute("aria-pressed", String(pressed));
  if (el.getAttribute("data-scope") === "button") {
    el.setAttribute("data-variant", chromeToggleVariant(pressed));
  }
}

function syncFrameworkButtons() {
  const current = currentFramework();
  document.querySelectorAll("[data-set-framework]").forEach((el) => {
    syncPressed(el, el.getAttribute("data-set-framework") === current);
  });
}

function syncThemeButton() {
  const dark = document.documentElement.classList.contains("dark");
  document.querySelectorAll("[data-toggle-theme]").forEach((el) => {
    el.setAttribute("aria-pressed", String(dark));
    el.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildToc() {
  const article = document.querySelector("[data-docs-article]");
  const list = document.querySelector("[data-toc]");
  const root = document.querySelector("[data-toc-root]");
  if (!(article instanceof HTMLElement) || !(list instanceof HTMLElement)) return;

  list.replaceChildren();
  const headings = [...article.querySelectorAll("h2, h3")];
  for (const heading of headings) {
    if (!(heading instanceof HTMLElement)) continue;
    if (!heading.id) heading.id = slugify(heading.textContent ?? "");
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    if (heading.tagName === "H3") link.dataset.depth = "3";
    item.append(link);
    list.append(item);
  }

  if (root instanceof HTMLElement) root.hidden = headings.length === 0;
}

function visibleSnippet(block: Element) {
  if (block.hasAttribute("data-pkg")) {
    const panel = [...block.querySelectorAll("[data-pkg-panel]")].find(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.hidden,
    );
    return panel?.dataset.snippet ?? panel?.textContent ?? "";
  }

  const framework = currentFramework();
  const node = block.querySelector(`[data-fw="${framework}"][data-snippet]`);
  return node instanceof HTMLElement ? (node.dataset.snippet ?? "") : "";
}

function setDemoView(block: Element, view: "preview" | "code") {
  block.querySelectorAll("[data-demo-view]").forEach((el) => {
    syncPressed(el, el.getAttribute("data-demo-view") === view);
  });
  block.querySelectorAll("[data-demo-panel]").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    el.hidden = el.dataset.demoPanel !== view;
  });
}

function setPkgTab(block: Element, tab: string) {
  block.querySelectorAll("[data-pkg-tab]").forEach((el) => {
    syncPressed(el, el.getAttribute("data-pkg-tab") === tab);
  });
  block.querySelectorAll("[data-pkg-panel]").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    el.hidden = el.dataset.pkgPanel !== tab;
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
    return;
  }

  const navButton = target.closest("[data-toggle-nav]");
  if (navButton) {
    setNavOpen(!("navOpen" in document.documentElement.dataset));
    return;
  }

  if (target.closest("[data-nav-backdrop]")) {
    setNavOpen(false);
    return;
  }

  const demoView = target.closest("[data-demo-view]");
  if (demoView) {
    const block = demoView.closest("[data-demo]");
    const view = demoView.getAttribute("data-demo-view");
    if (block && (view === "preview" || view === "code")) setDemoView(block, view);
    return;
  }

  const copyButton = target.closest("[data-copy-code]");
  if (copyButton) {
    const block = copyButton.closest("[data-demo], [data-pkg]");
    if (block) {
      const text = visibleSnippet(block).trim();
      if (text) void navigator.clipboard.writeText(text);
    }
    return;
  }

  const pkgTab = target.closest("[data-pkg-tab]");
  if (pkgTab) {
    const block = pkgTab.closest("[data-pkg]");
    const tab = pkgTab.getAttribute("data-pkg-tab");
    if (block && tab) setPkgTab(block, tab);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavOpen(false);
});

syncFrameworkButtons();
syncThemeButton();
buildToc();
