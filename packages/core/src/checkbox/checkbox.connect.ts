import { checkboxAnatomy } from "@kimak/spec";
import { createIds } from "../platform/ids";
import { visuallyHiddenStyle } from "../platform/hidden";
import { dataIf } from "../types";
import type { DictPropTypes, NormalizeProps, PropTypes } from "../normalize";
import type { Service } from "../machine";
import {
  getAriaChecked,
  getCheckedState,
  isChecked,
  type CheckboxContext,
  type CheckboxEvent,
  type CheckboxProps,
} from "./checkbox.types";

export interface CheckboxApi<T extends PropTypes = DictPropTypes> {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  setChecked: (checked: CheckboxProps["checked"] & {}) => void;
  toggle: () => void;
  getRootProps: () => T["label"];
  getLabelProps: () => T["element"];
  getControlProps: () => T["element"];
  getIndicatorProps: () => T["element"];
  getHiddenInputProps: () => T["input"];
}

export function connectCheckbox<T extends PropTypes>(
  service: Service<CheckboxContext, CheckboxProps, CheckboxEvent>,
  normalize: NormalizeProps<T>,
): CheckboxApi<T> {
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
        style: visuallyHiddenStyle,
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
