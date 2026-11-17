import { useState, type ReactNode } from "react";
import { Button, buttonAttrs } from "@kimak/ui-react";
import { useIconLibrary } from "../../components/IconLibraryPicker";
import type { ButtonExample } from "../../lib/snippets/button";
import { LibraryIcon } from "../icons/LibraryIcon";

function LoadingButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      onPress={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1200);
      }}
    >
      Save
    </Button>
  );
}

function IconsRow() {
  const library = useIconLibrary();
  return (
    <Row>
      <Button>
        <LibraryIcon library={library} role="save" data-icon="inline-start" aria-hidden="true" />
        Save
      </Button>
      <Button variant="outline">
        Next
        <LibraryIcon library={library} role="next" data-icon="inline-end" aria-hidden="true" />
      </Button>
      <Button size="icon" aria-label="Settings">
        <LibraryIcon library={library} role="settings" aria-hidden="true" />
      </Button>
    </Row>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

export function ButtonPreview({ example = "playground" }: { example?: ButtonExample }) {
  switch (example) {
    case "playground":
      return (
        <Row>
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
        </Row>
      );
    case "variants":
      return (
        <Row>
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Row>
      );
    case "sizes":
      return (
        <Row>
          <Button size="xs">XS</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
      );
    case "icons":
      return <IconsRow />;
    case "loading":
      return (
        <Row>
          <Button loading>Saving</Button>
          <LoadingButton />
        </Row>
      );
    case "link":
      return (
        <Row>
          <a href="/docs/getting-started" {...buttonAttrs({ variant: "outline" })}>
            Get started
          </a>
        </Row>
      );
    default: {
      const exhaustive: never = example;
      return exhaustive;
    }
  }
}
