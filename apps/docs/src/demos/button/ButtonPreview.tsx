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
      return (
        <Row>
          <Button>
            <Save data-icon="inline-start" size={16} aria-hidden="true" />
            Save
          </Button>
          <Button variant="outline">
            Next
            <ChevronRight data-icon="inline-end" size={16} aria-hidden="true" />
          </Button>
          <Button size="icon" aria-label="Settings">
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
    case "motion":
      return (
        <Row>
          <Button>Press</Button>
          <Button motion="soft">Soft</Button>
          <Button motion="bounce">Bounce</Button>
          <Button motion="sink">Sink</Button>
          <Button motion="lift">Lift</Button>
          <Button motion="ripple">Ripple</Button>
          <Button motion="magnetic">Magnetic</Button>
          <Button motion="shine">Shine</Button>
          <Button motion="none">None</Button>
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
