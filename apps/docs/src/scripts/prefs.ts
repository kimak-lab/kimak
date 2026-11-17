import { chromeToggleVariant } from "../lib/chrome";
import { FRAMEWORK_EVENT, getFramework, setFramework } from "../lib/framework";
import { isFramework } from "../lib/nav";
import { watchSystemTheme } from "../lib/theme";
import { initSearch } from "./search";

/** Mirrors `--breakpoint-nav` in global.css: below it the sidebar is a drawer. */
const DRAWER_QUERY = window.matchMedia("(width < 53.75rem)");

function isNavOpen() {
  return "navOpen" in document.documentElement.dataset;
}

/**
 * Mobile drawer. While open, page content behind the backdrop is inert so Tab
 * stays in header + drawer. On close, focus returns to the toggle if it was inside.
 */
function setNavOpen(open: boolean) {
  if (open === isNavOpen()) return;
  const root = document.documentElement;
  const drawer = document.getElementById("docs-nav");
  const toggle = document.querySelector<HTMLElement>("[data-toggle-nav]");

  if (open) root.dataset.navOpen = "";
  else delete root.dataset.navOpen;
  toggle?.setAttribute("aria-expanded", String(open));
  document.querySelectorAll<HTMLElement>("[data-nav-inert]").forEach((el) => {
    el.inert = open;
  });

  if (open) {
    const target =
      drawer?.querySelector<HTMLElement>('[aria-current="page"]') ??
      drawer?.querySelector<HTMLElement>("a[href], button");
    target?.focus();
  } else if (drawer?.contains(document.activeElement)) {
    toggle?.focus();
  }
}

function syncPressed(el: Element, pressed: boolean) {
  el.setAttribute("aria-pressed", String(pressed));
  if (el.getAttribute("data-scope") === "button") {
    el.setAttribute("data-variant", chromeToggleVariant(pressed));
  }
}

function syncFrameworkButtons() {
  const current = getFramework();
  document.querySelectorAll("[data-set-framework]").forEach((el) => {
    syncPressed(el, el.getAttribute("data-set-framework") === current);
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
  spyToc(headings.filter((h): h is HTMLElement => h instanceof HTMLElement), list);
}

/** Heading counts as "current" once its top passes below the sticky header. */
const TOC_SPY_OFFSET = 96;

function spyToc(headings: HTMLElement[], list: HTMLElement) {
  if (headings.length === 0) return;
  const links = new Map(
    [...list.querySelectorAll("a")].map((link) => [link.getAttribute("href")?.slice(1), link]),
  );
  let frame = 0;

  const update = () => {
    frame = 0;
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let active = headings[0];
    if (atBottom) active = headings[headings.length - 1];
    else {
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > TOC_SPY_OFFSET) break;
        active = heading;
      }
    }
    for (const [id, link] of links) {
      if (id === active.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
}

function visibleSnippet(block: Element) {
  if (block.hasAttribute("data-pkg")) {
    const panel = [...block.querySelectorAll("[data-pkg-panel]")].find(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.hidden,
    );
    return panel?.dataset.snippet ?? panel?.textContent ?? "";
  }

  const framework = getFramework();
  const library = document.documentElement.dataset.iconLibrary ?? "lucide";
  const node =
    block.querySelector(`[data-fw="${framework}"][data-icon-lib="${library}"][data-snippet]`) ??
    block.querySelector(`[data-fw="${framework}"]:not([data-icon-lib])[data-snippet]`);
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

  const navButton = target.closest("[data-toggle-nav]");
  if (navButton) {
    setNavOpen(!isNavOpen());
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

// On window so it runs after document-level handlers (an open Popover in the
// drawer handles Escape first and marks it defaultPrevented).
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !event.defaultPrevented && isNavOpen()) setNavOpen(false);
});

DRAWER_QUERY.addEventListener("change", (event) => {
  if (!event.matches) setNavOpen(false);
});

// Demo tabs and the sidebar picker share one store; the event keeps tabs in sync.
window.addEventListener(FRAMEWORK_EVENT, syncFrameworkButtons);
syncFrameworkButtons();
watchSystemTheme();
initSearch({ beforeOpen: () => setNavOpen(false) });
buildToc();
