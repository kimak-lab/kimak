export type PopoverExample = "basic" | "sides" | "controlled";

export const popoverSnippets = {
  basic: {
    react: `import { Popover, buttonAttrs } from "@kimak/ui-react";

<Popover>
  <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>Open popover</Popover.Trigger>
  <Popover.Content className="w-72">
    <Popover.Title>Dimensions</Popover.Title>
    <Popover.Description>Set the dimensions for the layer.</Popover.Description>
    <Popover.Close {...buttonAttrs({ size: "sm" })}>Done</Popover.Close>
  </Popover.Content>
</Popover>`,
  },
  sides: {
    react: `import { Popover, buttonAttrs } from "@kimak/ui-react";

{(["top", "right", "bottom", "left"] as const).map((side) => (
  <Popover key={side} side={side}>
    <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>{side}</Popover.Trigger>
    <Popover.Content>Placed on the {side}.</Popover.Content>
  </Popover>
))}`,
  },
  controlled: {
    react: `import { useState } from "react";
import { Popover, buttonAttrs } from "@kimak/ui-react";

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>
        {open ? "Close" : "Open"}
      </Popover.Trigger>
      <Popover.Content>
        <button type="button" {...buttonAttrs({ size: "sm" })} onClick={() => setOpen(false)}>
          Close from content
        </button>
      </Popover.Content>
    </Popover>
  );
}`,
  },
} as const satisfies Record<PopoverExample, { react: string }>;
