import { useState } from "react";
import { Button, Checkbox, Dialog } from "@kimak/ui-react";

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

export function App() {
  return (
    <main>
      <p className="eyebrow text-muted-foreground">Kimak playground</p>
      <h1>Headless golden pair</h1>
      <p className="text-muted-foreground">
        Product API comes from <code>@kimak/ui-react</code>. Parts come from{" "}
        <code>@kimak/headless-react</code>. Look comes from{" "}
        <code>@plugin "@kimak/tailwind"</code> targeting anatomy <code>data-*</code>{" "}
        attributes. Recolor with tokens in <code>styles.css</code>.
      </p>

      <section>
        <h2>Button</h2>
        <div className="stack">
          <div className="row">
            <Button data-size="sm">Small</Button>
            <Button data-size="md">Medium</Button>
            <Button data-size="lg">Large</Button>
            <Button disabled>Disabled</Button>
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
        </div>
      </section>

      <section>
        <h2>Checkbox</h2>
        <div className="stack">
          <Checkbox data-size="sm">Small</Checkbox>
          <Checkbox data-size="md">I agree to the terms</Checkbox>
          <Checkbox defaultChecked="indeterminate" data-size="lg">
            Large mixed
          </Checkbox>
        </div>
      </section>

      <section>
        <h2>Dialog</h2>
        <Dialog.Root>
          <Dialog.Trigger render={<button type="button" />}>Open dialog</Dialog.Trigger>
          <Dialog.Content data-size="md">
            <Dialog.Title>Styled by the Tailwind plugin</Dialog.Title>
            <Dialog.Description>
              Focus is trapped. Escape and the close button dismiss. Size is{" "}
              <code>data-size</code> on content, not a machine prop.
            </Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      </section>
    </main>
  );
}
