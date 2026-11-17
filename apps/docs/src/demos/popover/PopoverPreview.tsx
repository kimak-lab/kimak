import { useState, type ReactNode } from "react";
import { buttonAttrs, Popover } from "@kimak/ui-react";
import type { PopoverExample } from "../../lib/snippets/popover";

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>{open ? "Close" : "Open"}</Popover.Trigger>
      <Popover.Content>
        <button type="button" {...buttonAttrs({ size: "sm" })} onClick={() => setOpen(false)}>
          Close from content
        </button>
      </Popover.Content>
    </Popover>
  );
}

const sides = ["top", "right", "bottom", "left"] as const;

export function PopoverPreview({ example = "basic" }: { example?: PopoverExample }) {
  switch (example) {
    case "basic":
      return (
        <Row>
          <Popover>
            <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>Open popover</Popover.Trigger>
            <Popover.Content className="w-72">
              <Popover.Title>Dimensions</Popover.Title>
              <Popover.Description>Set the dimensions for the layer.</Popover.Description>
              <div className="mt-3 flex justify-end">
                <Popover.Close {...buttonAttrs({ size: "sm" })}>Done</Popover.Close>
              </div>
            </Popover.Content>
          </Popover>
        </Row>
      );
    case "sides":
      return (
        <Row>
          {sides.map((side) => (
            <Popover key={side} side={side}>
              <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>{side}</Popover.Trigger>
              <Popover.Content>
                <p className="m-0 text-sm">Placed on the {side}.</p>
              </Popover.Content>
            </Popover>
          ))}
        </Row>
      );
    case "controlled":
      return (
        <Row>
          <Controlled />
        </Row>
      );
    default: {
      const exhaustive: never = example;
      return exhaustive;
    }
  }
}
