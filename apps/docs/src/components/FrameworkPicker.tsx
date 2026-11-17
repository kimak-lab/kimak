import { useState, useSyncExternalStore } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { IconBrandReact, IconBrandSvelte, IconBrandVue } from "@tabler/icons-react";
import { buttonAttrs, Popover } from "@kimak/ui-react";
import {
  frameworkLabels,
  getFramework,
  getServerFramework,
  setFramework,
  subscribeFramework,
} from "../lib/framework";
import { FRAMEWORKS, type Framework } from "../lib/nav";

/** Brand marks; color is docs chrome, not component look. */
function FrameworkMark({ framework }: { framework: Framework }) {
  switch (framework) {
    case "react":
      return <IconBrandReact className="size-4.5! text-[#087ea4] dark:text-[#58c4dc]" aria-hidden="true" />;
    case "vue":
      return <IconBrandVue className="size-4.5! text-[#41b883]" aria-hidden="true" />;
    case "svelte":
      return <IconBrandSvelte className="size-4.5! text-[#ff3e00]" aria-hidden="true" />;
    default: {
      const exhaustive: never = framework;
      return exhaustive;
    }
  }
}

export function FrameworkPicker() {
  const current = useSyncExternalStore(subscribeFramework, getFramework, getServerFramework);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.8rem] text-muted-foreground" aria-hidden="true">
        Select your framework
      </span>
      <Popover open={open} onOpenChange={setOpen} align="start">
        <Popover.Trigger
          {...buttonAttrs({ variant: "outline", size: "md" })}
          className="h-11 w-full justify-start gap-2.5 rounded-[0.8rem] px-3 text-[0.95rem]"
          aria-label={`Framework: ${frameworkLabels[current]}`}
        >
          {/* Every option is rendered; `html[data-framework]` CSS shows the active one before hydrate. */}
          {FRAMEWORKS.map((framework) => (
            <span key={framework} data-fw={framework} className="inline-flex items-center gap-2.5">
              <FrameworkMark framework={framework} />
              {frameworkLabels[framework]}
            </span>
          ))}
          <ChevronsUpDown className="ml-auto text-muted-foreground" aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Content aria-label="Framework" className="w-(--kimak-anchor-width) p-1">
          <ul className="m-0 flex list-none flex-col p-0">
            {FRAMEWORKS.map((framework) => {
              const active = framework === current;
              return (
                <li key={framework}>
                  <button
                    type="button"
                    {...buttonAttrs({ variant: "ghost", size: "sm" })}
                    className="h-9 w-full justify-start gap-2.5 font-normal"
                    aria-pressed={active}
                    onClick={() => {
                      setFramework(framework);
                      setOpen(false);
                    }}
                  >
                    <FrameworkMark framework={framework} />
                    {frameworkLabels[framework]}
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
    </div>
  );
}
