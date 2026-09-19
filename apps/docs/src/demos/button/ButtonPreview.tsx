import { useState, type ReactNode } from "react";
import { ChevronRight, Save, Settings } from "lucide-react";
import { Button, buttonAttrs } from "@kimak/ui-react";
import type { ButtonExample } from "../../lib/snippets/button";

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

function Row({ children }: { children: ReactNode }) {
  return <div className="row">{children}</div>;
}

export function ButtonPreview({ example = "playground" }: { example?: ButtonExample }) {
  switch (example) {
    case "playground":
      return (
        <Row>
          <Button>Save</Button>
          <Button data-variant="outline">Cancel</Button>
        </Row>
      );
    case "variants":
      return (
        <Row>
          <Button>Default</Button>
          <Button data-variant="secondary">Secondary</Button>
          <Button data-variant="outline">Outline</Button>
          <Button data-variant="ghost">Ghost</Button>
          <Button data-variant="destructive">Destructive</Button>
          <Button data-variant="link">Link</Button>
        </Row>
      );
    case "sizes":
      return (
        <Row>
          <Button data-size="xs">XS</Button>
          <Button data-size="sm">Small</Button>
          <Button data-size="md">Medium</Button>
          <Button data-size="lg">Large</Button>
        </Row>
      );
    case "icons":
      return (
        <Row>
          <Button>
            <Save data-icon="inline-start" size={16} aria-hidden="true" />
            Save
          </Button>
          <Button data-variant="outline">
            Next
            <ChevronRight data-icon="inline-end" size={16} aria-hidden="true" />
          </Button>
          <Button data-size="icon" aria-label="Settings">
            <Settings size={16} />
          </Button>
        </Row>
      );
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
