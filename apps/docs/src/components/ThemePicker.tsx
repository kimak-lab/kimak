import { useState, useSyncExternalStore } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { buttonAttrs, Popover } from "@kimak/ui-react";
import { chromeIdleVariant } from "../lib/chrome";
import {
  getServerThemePreference,
  getThemePreference,
  setThemePreference,
  subscribeThemePreference,
  THEME_PREFERENCES,
  themeLabels,
  type ThemePreference,
} from "../lib/theme";

const themeIcons: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemePicker() {
  const current = useSyncExternalStore(
    subscribeThemePreference,
    getThemePreference,
    getServerThemePreference,
  );
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} align="end">
      <Popover.Trigger
        {...buttonAttrs({ variant: chromeIdleVariant, size: "icon-sm" })}
        aria-label={`Theme: ${themeLabels[current]}`}
        title="Theme"
      >
        {/* Resolved theme comes from `html.dark`, so the icon never flashes on hydrate. */}
        <Sun className="dark:hidden" aria-hidden="true" />
        <Moon className="hidden dark:inline" aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Content aria-label="Theme" className="w-40 p-1">
        <ul className="m-0 flex list-none flex-col p-0">
          {THEME_PREFERENCES.map((preference) => {
            const active = preference === current;
            const Icon = themeIcons[preference];
            return (
              <li key={preference}>
                <button
                  type="button"
                  {...buttonAttrs({ variant: "ghost", size: "sm" })}
                  className="w-full justify-start font-normal"
                  aria-pressed={active}
                  onClick={() => {
                    setThemePreference(preference);
                    setOpen(false);
                  }}
                >
                  <Icon data-icon="inline-start" aria-hidden="true" />
                  {themeLabels[preference]}
                  {active ? (
                    <Check data-icon="inline-end" className="ml-auto" aria-hidden="true" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover.Content>
    </Popover>
  );
}
