import { Checkbox, Dialog } from "@kimak/react";

export function App() {
  return (
    <main>
      <p className="eyebrow">Kimak playground</p>
      <h1>Headless golden pair</h1>
      <p className="lede">
        CSS below lives only in this app. Published packages ship parts and{" "}
        <code>data-*</code> attributes, not look.
      </p>

      <section>
        <h2>Checkbox</h2>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
              </svg>
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label>I agree to the terms</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </section>

      <section>
        <h2>Dialog</h2>
        <Dialog.Root>
          <Dialog.Trigger>Open dialog</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Title>Unstyled on purpose</Dialog.Title>
                <Dialog.Description>
                  Focus is trapped. Escape and the close button dismiss. Style
                  this overlay in your product, not in Kimak.
                </Dialog.Description>
                <Dialog.Close>Close</Dialog.Close>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Portal>
        </Dialog.Root>
      </section>
    </main>
  );
}
