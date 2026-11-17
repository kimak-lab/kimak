export const THEME_PREFERENCES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const THEME_KEY = "kimak.docs.theme";

export const THEME_EVENT = "kimak:theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export const themeLabels: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  switch (value) {
    case "light":
    case "dark":
    case "system":
      return true;
    default:
      return false;
  }
}

/** Preference from `<html data-theme-preference>`, set by the inline boot script. */
export function getThemePreference(): ThemePreference {
  if (typeof document === "undefined") return "system";
  const value = document.documentElement.dataset.themePreference;
  return isThemePreference(value) ? value : "system";
}

export function getServerThemePreference(): ThemePreference {
  return "system";
}

function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  const dark =
    preference === "dark" || (preference === "system" && window.matchMedia(DARK_QUERY).matches);
  root.dataset.themePreference = preference;
  root.classList.toggle("dark", dark);
}

export function setThemePreference(preference: ThemePreference): void {
  applyTheme(preference);
  try {
    if (preference === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, preference);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: preference }));
}

export function subscribeThemePreference(listener: () => void): () => void {
  window.addEventListener(THEME_EVENT, listener);
  return () => window.removeEventListener(THEME_EVENT, listener);
}

/** Follow the OS while the preference is "system". Call once per page. */
export function watchSystemTheme(): void {
  window.matchMedia(DARK_QUERY).addEventListener("change", () => {
    if (getThemePreference() === "system") applyTheme("system");
  });
}
