export const FRAMEWORKS = ["react", "vue", "svelte"] as const;

export type Framework = (typeof FRAMEWORKS)[number];

export interface NavItem {
  href: string;
  label: string;
}

export interface NavSection {
  title: string;
  items: readonly NavItem[];
}

export const nav: readonly NavSection[] = [
  {
    title: "Start",
    items: [
      { href: "/docs/getting-started", label: "Getting started" },
      { href: "/docs/installation", label: "Installation" },
    ],
  },
  {
    title: "Guides",
    items: [
      { href: "/docs/styling", label: "Styling" },
      { href: "/docs/architecture", label: "Architecture" },
    ],
  },
  {
    title: "Components",
    items: [{ href: "/docs/components/button", label: "Button" }],
  },
];

export function flattenNav(): NavItem[] {
  return nav.flatMap((section) => [...section.items]);
}

export function adjacent(pathname: string): { prev?: NavItem; next?: NavItem } {
  const items = flattenNav();
  const current = pathname.replace(/\/$/, "") || "/";
  const index = items.findIndex((item) => item.href === current);
  if (index < 0) return {};
  return {
    prev: index > 0 ? items[index - 1] : undefined,
    next: index < items.length - 1 ? items[index + 1] : undefined,
  };
}

export function isFramework(value: string | null | undefined): value is Framework {
  switch (value) {
    case "react":
    case "vue":
    case "svelte":
      return true;
    default:
      return false;
  }
}
