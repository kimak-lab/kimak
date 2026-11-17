import type { ReactNode } from "react";
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonAttrs,
  Popover,
} from "@kimak/ui-react";
import type { ButtonGroupExample } from "../../lib/snippets/button-group";


function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ButtonGroupPreview({ example = "basic" }: { example?: ButtonGroupExample }) {
  switch (example) {
    case "basic":
      return (
        <ButtonGroup aria-label="Archive">
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
          <Button variant="outline">Snooze</Button>
        </ButtonGroup>
      );
    case "orientation":
      return (
        <ButtonGroup orientation="vertical" aria-label="Zoom">
          <Button variant="outline" size="icon" aria-label="Zoom in">
            +
          </Button>
          <Button variant="outline" size="icon" aria-label="Zoom out">
            −
          </Button>
        </ButtonGroup>
      );
    case "sizes":
      return (
        <Row>
          <ButtonGroup aria-label="Small">
            <Button variant="outline" size="sm">Small</Button>
            <Button variant="outline" size="sm">Button</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Default">
            <Button variant="outline">Default</Button>
            <Button variant="outline">Button</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Large">
            <Button variant="outline" size="lg">Large</Button>
            <Button variant="outline" size="lg">Button</Button>
          </ButtonGroup>
        </Row>
      );
    case "nested":
      return (
        <ButtonGroup aria-label="Pagination">
          <ButtonGroup>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </ButtonGroup>
        </ButtonGroup>
      );
    case "separator":
      return (
        <ButtonGroup aria-label="Clipboard">
          <Button variant="secondary" size="sm">Copy</Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="sm">Paste</Button>
        </ButtonGroup>
      );
    case "split":
      return (
        <ButtonGroup aria-label="Merge">
          <Button>Merge</Button>
          <ButtonGroupSeparator />
          <Button size="icon" aria-label="More merge options">
            <Chevron />
          </Button>
        </ButtonGroup>
      );
    case "input":
      return (
        <ButtonGroup>
          <ButtonGroupText render={<label htmlFor="bg-site-react" />}>https://</ButtonGroupText>
          <input id="bg-site-react" placeholder="example.com" data-demo-input />
          <Button variant="outline">Go</Button>
        </ButtonGroup>
      );
    case "popover":
      return (
        <ButtonGroup aria-label="Copilot">
          <Button variant="outline">Copilot</Button>
          <Popover align="end">
            <Popover.Trigger {...buttonAttrs({ variant: "outline", size: "icon" })} aria-label="Agent tasks">
              <Chevron />
            </Popover.Trigger>
            <Popover.Content className="w-72">
              <Popover.Title>Agent tasks</Popover.Title>
              <Popover.Description>Describe your task in natural language.</Popover.Description>
            </Popover.Content>
          </Popover>
        </ButtonGroup>
      );
    default: {
      const exhaustive: never = example;
      return exhaustive;
    }
  }
}
