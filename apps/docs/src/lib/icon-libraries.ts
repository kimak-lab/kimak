import type { Framework } from "./nav";

export const ICON_LIBRARIES = ["lucide", "tabler", "hugeicons", "phosphor", "remix"] as const;

export type IconLibrary = (typeof ICON_LIBRARIES)[number];

export const DEFAULT_ICON_LIBRARY: IconLibrary = "lucide";

export const ICON_LIBRARY_KEY = "kimak.docs.iconLibrary";

export const ICON_LIBRARY_EVENT = "kimak:icon-library";

export interface IconLibraryInfo {
  label: string;
  homepage: string;
  /** Packages to install per framework. */
  packages: Record<Framework, readonly string[]>;
  /** Packages maintained outside the icon set's own org. */
  community?: readonly Framework[];
}

export function isIconLibrary(value: string | null | undefined): value is IconLibrary {
  switch (value) {
    case "lucide":
    case "tabler":
    case "hugeicons":
    case "phosphor":
    case "remix":
      return true;
    default:
      return false;
  }
}

export const iconLibraries: Record<IconLibrary, IconLibraryInfo> = {
  lucide: {
    label: "Lucide",
    homepage: "https://lucide.dev",
    packages: {
      react: ["lucide-react"],
      vue: ["@lucide/vue"],
      svelte: ["@lucide/svelte"],
    },
  },
  tabler: {
    label: "Tabler Icons",
    homepage: "https://tabler.io/icons",
    packages: {
      react: ["@tabler/icons-react"],
      vue: ["@tabler/icons-vue"],
      svelte: ["@tabler/icons-svelte"],
    },
  },
  hugeicons: {
    label: "Hugeicons",
    homepage: "https://hugeicons.com",
    packages: {
      react: ["@hugeicons/react", "@hugeicons/core-free-icons"],
      vue: ["@hugeicons/vue", "@hugeicons/core-free-icons"],
      svelte: ["@hugeicons/svelte", "@hugeicons/core-free-icons"],
    },
  },
  phosphor: {
    label: "Phosphor Icons",
    homepage: "https://phosphoricons.com",
    packages: {
      react: ["@phosphor-icons/react"],
      vue: ["@phosphor-icons/vue"],
      svelte: ["phosphor-svelte"],
    },
    community: ["svelte"],
  },
  remix: {
    label: "Remix Icon",
    homepage: "https://remixicon.com",
    packages: {
      react: ["@remixicon/react"],
      vue: ["@remixicon/vue"],
      svelte: ["svelte-remixicon"],
    },
    community: ["svelte"],
  },
};

/** Active library from `<html data-icon-library>`. Server snapshot is the default. */
export function getIconLibrary(): IconLibrary {
  if (typeof document === "undefined") return DEFAULT_ICON_LIBRARY;
  const value = document.documentElement.dataset.iconLibrary;
  return isIconLibrary(value) ? value : DEFAULT_ICON_LIBRARY;
}

export function getServerIconLibrary(): IconLibrary {
  return DEFAULT_ICON_LIBRARY;
}

export function setIconLibrary(library: IconLibrary): void {
  document.documentElement.dataset.iconLibrary = library;
  try {
    localStorage.setItem(ICON_LIBRARY_KEY, library);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent(ICON_LIBRARY_EVENT, { detail: library }));
}

export function subscribeIconLibrary(listener: () => void): () => void {
  window.addEventListener(ICON_LIBRARY_EVENT, listener);
  return () => window.removeEventListener(ICON_LIBRARY_EVENT, listener);
}
