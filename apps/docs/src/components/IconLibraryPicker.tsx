import { useState, useSyncExternalStore } from "react";
import { Check, ChevronDown } from "lucide-react";
import { buttonAttrs, Popover } from "@kimak/ui-react";
import {
  getIconLibrary,
  getServerIconLibrary,
  ICON_LIBRARIES,
  iconLibraries,
  setIconLibrary,
  subscribeIconLibrary,
} from "../lib/icon-libraries";

export function useIconLibrary() {
  return useSyncExternalStore(subscribeIconLibrary, getIconLibrary, getServerIconLibrary);
}

export function IconLibraryPicker({ align = "end" }: { align?: "start" | "center" | "end" }) {
  const current = useIconLibrary();
  const [open, setOpen] = useState(false);
  const label = iconLibraries[current].label;

  return (
    <Popover open={open} onOpenChange={setOpen} align={align}>
      <Popover.Trigger
        {...buttonAttrs({ variant: "outline", size: "sm" })}
        aria-label={`Icon library: ${label}`}
        title="Icon library"
      >
        {/* Every label is rendered; `html[data-icon-library]` CSS shows the active one before hydrate. */}
        {ICON_LIBRARIES.map((library) => (
          <span key={library} data-icon-lib={library}>
            {iconLibraries[library].label}
          </span>
        ))}
        <ChevronDown data-icon="inline-end" aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Content aria-label="Icon library" className="w-48 p-1">
        <ul className="m-0 flex list-none flex-col p-0">
          {ICON_LIBRARIES.map((library) => {
            const active = library === current;
            return (
              <li key={library}>
                <button
                  type="button"
                  {...buttonAttrs({ variant: "ghost", size: "sm" })}
                  className="w-full justify-between font-normal"
                  aria-pressed={active}
                  onClick={() => {
                    setIconLibrary(library);
                    setOpen(false);
                  }}
                >
                  {iconLibraries[library].label}
                  {active ? <Check data-icon="inline-end" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover.Content>
    </Popover>
  );
}
