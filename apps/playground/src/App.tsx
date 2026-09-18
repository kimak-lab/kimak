import { Checkbox, Dialog } from "@kimak/ui-react";

export function App() {
  return (
    <main>
      <p className="eyebrow">Kimak playground</p>
      <h1>Headless golden pair</h1>
      <p className="lede">
        Product API comes from <code>@kimak/ui-react</code>. Parts come from{" "}
        <code>@kimak/headless-react</code>. Look comes from{" "}
        <code>@plugin "@kimak/tailwind"</code> targeting anatomy <code>data-*</code>{" "}
        attributes.
      </p>

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
