import { useState } from "react";
import { ChevronRight, Save, Settings } from "lucide-react";
import { Button } from "@kimak/ui-react";

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

export function ButtonPreview() {
  return (
    <div className="stack">
      <div className="row">
        <Button data-size="sm">Small</Button>
        <Button data-size="md">Medium</Button>
        <Button data-size="lg">Large</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <LoadingButton />
        <Button className="rounded-full">Custom class</Button>
      </div>
      <div className="row">
        <Button>Default</Button>
        <Button data-variant="secondary">Secondary</Button>
        <Button data-variant="outline">Outline</Button>
        <Button data-variant="ghost">Ghost</Button>
        <Button data-variant="destructive">Destructive</Button>
      </div>
      <div className="row">
        <Button>
          <Save size={16} aria-hidden="true" />
          Save
        </Button>
        <Button data-variant="outline">
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
        <Button className="w-9 px-0" aria-label="Settings">
          <Settings size={16} />
        </Button>
      </div>
    </div>
  );
}
