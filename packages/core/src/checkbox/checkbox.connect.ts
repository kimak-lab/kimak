import { checkboxAnatomy } from "@kimak/spec";
import { createIds } from "../platform/ids";
import { getCheckedState, dataIf, type PropTypes } from "../types";
import type { Service } from "../machine";
import {
  getAriaChecked,
  isChecked,
  type CheckboxContext,
  type CheckboxEvent,
  type CheckboxProps,
} from "./checkbox.types";

export interface CheckboxApi {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  setChecked: (checked: CheckboxProps["checked"] & {}) => void;
  toggle: () => void;
  getRootProps: () => Record<string, unknown>;
  getLabelProps: () => Record<string, unknown>;
  getControlProps: () => Record<string, unknown>;
  getIndicatorProps: () => Record<string, unknown>;
  getHiddenInputProps: () => Record<string, unknown>;
}

const visuallyHidden: Record<string, string> = {
  border: "0",
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
};

export function connectCheckbox(
  service: Service<CheckboxContext, CheckboxProps, CheckboxEvent>,
  normalize: PropTypes,
): CheckboxApi {
  const snapshot = service.getSnapshot();
  const { props, context } = snapshot;
  const checked = props.checked ?? context.checked;
  const disabled = Boolean(props.disabled);
  const readOnly = Boolean(props.readOnly);
  const invalid = Boolean(props.invalid);
  const required = Boolean(props.required);
  const dataState = getCheckedState(checked);
  const ids = {
    ...createIds(props.id ?? "checkbox", checkboxAnatomy.parts),
    ...props.ids,
  };

  return {
    checked: isChecked(checked),
    indeterminate: checked === "indeterminate",
    disabled,
    setChecked: (next) => {
      service.send({ type: "SET_CHECKED", checked: next });
    },
    toggle: () => {
      service.send({ type: "TOGGLE" });
    },
    getRootProps: () =>
      normalize.label({
        ...checkboxAnatomy.root.attrs(),
        "data-state": dataState,
        "data-disabled": dataIf(disabled),
        "data-invalid": dataIf(invalid),
        "data-readonly": dataIf(readOnly),
        "data-required": dataIf(required),
        dir: props.dir ?? "ltr",
        id: ids.root,
        htmlFor: ids.hiddenInput,
      }),
    getLabelProps: () =>
      normalize.element({
        ...checkboxAnatomy.label.attrs(),
        "data-state": dataState,
        "data-disabled": dataIf(disabled),
        id: ids.label,
      }),
    getControlProps: () =>
      normalize.element({
        ...checkboxAnatomy.control.attrs(),
        "data-state": dataState,
        "data-disabled": dataIf(disabled),
        "data-invalid": dataIf(invalid),
        "data-readonly": dataIf(readOnly),
        "data-required": dataIf(required),
        id: ids.control,
        role: "checkbox",
        tabIndex: disabled ? undefined : 0,
        "aria-checked": getAriaChecked(checked),
        "aria-disabled": disabled || undefined,
        "aria-invalid": invalid || undefined,
        "aria-required": required || undefined,
        "aria-readonly": readOnly || undefined,
        onClick: (event: MouseEvent) => {
          event.preventDefault();
          service.send({ type: "TOGGLE" });
        },
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === " ") {
            event.preventDefault();
            service.send({ type: "TOGGLE" });
          }
        },
      }),
    getIndicatorProps: () =>
      normalize.element({
        ...checkboxAnatomy.indicator.attrs(),
        "data-state": dataState,
      }),
    getHiddenInputProps: () =>
      normalize.input({
        ...checkboxAnatomy.hiddenInput.attrs(),
        id: ids.hiddenInput,
        type: "checkbox",
        name: props.name,
        form: props.form,
        value: props.value ?? "on",
        checked: isChecked(checked),
        disabled,
        required,
        readOnly,
        "aria-hidden": true,
        tabIndex: -1,
        style: visuallyHidden,
        ref: (node: HTMLInputElement | null) => {
          service.refs.hiddenInput = node;
          if (node) node.indeterminate = checked === "indeterminate";
        },
        onChange: (event: Event) => {
          const target = event.target as HTMLInputElement;
          service.send({ type: "SET_CHECKED", checked: target.checked });
        },
      }),
  };
}
