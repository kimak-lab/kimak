import type { SearchEntry } from "../lib/search";

interface Hit {
  href: string;
  title: string;
  context: string;
  score: number;
}

const MAX_HITS = 12;

const optionClass =
  "flex flex-col gap-0.5 rounded-[0.7rem] px-3 py-2 text-[0.9rem] text-foreground aria-selected:bg-[color-mix(in_oklab,var(--docs-article)_70%,var(--accent))]";
const contextClass = "text-[0.75rem] text-muted-foreground";

let index: Promise<SearchEntry[]> | null = null;

function loadIndex(): Promise<SearchEntry[]> {
  index ??= fetch("/search.json")
    .then((response) => {
      if (!response.ok) throw new Error(`search index: ${response.status}`);
      return response.json() as Promise<SearchEntry[]>;
    })
    .catch((error: unknown) => {
      index = null;
      throw error;
    });
  return index;
}

function includesAll(haystack: string, terms: readonly string[]) {
  return terms.every((term) => haystack.includes(term));
}

function search(entries: readonly SearchEntry[], query: string): Hit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return entries.map((entry) => ({
      href: entry.href,
      title: entry.title,
      context: entry.section,
      score: 0,
    }));
  }

  const hits: Hit[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    if (includesAll(title, terms)) {
      hits.push({
        href: entry.href,
        title: entry.title,
        context: entry.section,
        score: title.startsWith(terms[0] ?? "") ? 4 : 3,
      });
    } else if (includesAll(`${title} ${entry.section} ${entry.description}`.toLowerCase(), terms)) {
      hits.push({ href: entry.href, title: entry.title, context: entry.description, score: 1 });
    }

    for (const heading of entry.headings) {
      if (!includesAll(`${heading.text} ${entry.title}`.toLowerCase(), terms)) continue;
      hits.push({
        href: `${entry.href}#${heading.slug}`,
        title: heading.text,
        context: entry.title,
        score: includesAll(heading.text.toLowerCase(), terms) ? 2 : 0.5,
      });
    }
  }
  // Array#sort is stable, so equal scores keep nav order.
  return hits.sort((a, b) => b.score - a.score).slice(0, MAX_HITS);
}

export function initSearch({ beforeOpen }: { beforeOpen?: () => void } = {}): void {
  const dialog = document.querySelector("[data-search-dialog]");
  const input = document.querySelector("[data-search-input]");
  const list = document.querySelector("[data-search-results]");
  const status = document.querySelector("[data-search-status]");
  if (
    !(dialog instanceof HTMLDialogElement) ||
    !(input instanceof HTMLInputElement) ||
    !(list instanceof HTMLElement) ||
    !(status instanceof HTMLElement)
  ) {
    return;
  }

  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
  document.querySelectorAll("[data-search-kbd]").forEach((el) => {
    el.textContent = isMac ? "⌘K" : "Ctrl K";
  });

  let options: HTMLAnchorElement[] = [];
  let active = -1;
  let request = 0;

  const setActive = (next: number) => {
    active = options.length === 0 ? -1 : (next + options.length) % options.length;
    options.forEach((option, i) => option.setAttribute("aria-selected", String(i === active)));
    const current = options[active];
    if (current) {
      input.setAttribute("aria-activedescendant", current.id);
      current.scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  };

  const render = (hits: readonly Hit[], query: string) => {
    options = hits.map((hit, i) => {
      const link = document.createElement("a");
      link.id = `search-option-${i}`;
      link.href = hit.href;
      link.tabIndex = -1;
      link.setAttribute("role", "option");
      link.className = optionClass;
      const title = document.createElement("span");
      title.textContent = hit.title;
      const context = document.createElement("span");
      context.className = contextClass;
      context.textContent = hit.context;
      link.append(title, context);
      link.addEventListener("pointermove", () => {
        if (active !== i) setActive(i);
      });
      return link;
    });
    list.replaceChildren(
      ...options.map((option) => {
        const item = document.createElement("li");
        item.setAttribute("role", "none");
        item.append(option);
        return item;
      }),
    );
    input.setAttribute("aria-expanded", String(options.length > 0));
    status.textContent = options.length === 0 ? `No results for “${query}”` : "";
    setActive(0);
  };

  const update = async () => {
    const id = ++request;
    const query = input.value.trim();
    try {
      const entries = await loadIndex();
      if (id === request) render(search(entries, query), query);
    } catch {
      if (id !== request) return;
      list.replaceChildren();
      options = [];
      setActive(-1);
      status.textContent = "Search is unavailable right now.";
    }
  };

  const open = () => {
    if (dialog.open) return;
    beforeOpen?.();
    dialog.showModal();
    input.select();
    if (options.length === 0) {
      status.textContent = "Loading…";
      void update();
    }
  };

  input.addEventListener("input", () => void update());

  input.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive(active + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive(active - 1);
        break;
      case "Enter": {
        const current = options[active];
        if (!current) break;
        event.preventDefault();
        dialog.close();
        window.location.assign(current.href);
        break;
      }
      default:
        break;
    }
  });

  // Same-page heading links do not reload, so close the dialog explicitly.
  list.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) dialog.close();
  });

  // Light dismiss: the dialog has no padding, so a click on the element itself is the backdrop.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-open-search]")) open();
  });

  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.altKey) return;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
      return;
    }
    if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable || target.closest("input, textarea, select"))
    ) {
      return;
    }
    event.preventDefault();
    open();
  });
}
