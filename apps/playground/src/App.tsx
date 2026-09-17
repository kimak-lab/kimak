import { Checkbox, Dialog } from "@kimak/react";

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function App() {
  return (
    <main>
      <p className="eyebrow">Kimak playground</p>
      <h1>Headless golden pair</h1>
      <p className="lede">
        Parts come from <code>@kimak/react</code>. Look comes from{" "}
        <code>@plugin "@kimak/tailwind"</code> targeting anatomy{" "}
        <code>data-*</code> attributes.
      </p>

      <section>
        <h2>Checkbox</h2>
        <div className="stack">
          <Checkbox.Root data-size="sm">
            <Checkbox.Control>
              <Checkbox.Indicator>
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>Small</Checkbox.Label>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
          <Checkbox.Root data-size="md">
            <Checkbox.Control>
              <Checkbox.Indicator>
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>I agree to the terms</Checkbox.Label>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
          <Checkbox.Root defaultChecked="indeterminate" data-size="lg">
            <Checkbox.Control>
              <Checkbox.Indicator>
                <DashIcon />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>Large mixed</Checkbox.Label>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        </div>
      </section>

      <section>
        <h2>Dialog</h2>
        <Dialog.Root>
          <Dialog.Trigger render={<button type="button" />}>Open dialog</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content data-size="md">
                <Dialog.Title>Styled by the Tailwind plugin</Dialog.Title>
                <Dialog.Description>
                  Focus is trapped. Escape and the close button dismiss. Size is{" "}
                  <code>data-size</code> on content, not a machine prop.
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
