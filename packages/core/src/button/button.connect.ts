import { buttonAnatomy } from "@kimak/spec";
import { createIds } from "../platform/ids";
import { dataIf } from "../types";
import type { DictPropTypes, NormalizeProps, PropTypes } from "../normalize";
import type { Service } from "../machine";
import type { ButtonContext, ButtonEvent, ButtonProps } from "./button.types";

export interface ButtonApi<T extends PropTypes = DictPropTypes> {
  disabled: boolean;
  loading: boolean;
  press: () => void;
  getRootProps: () => T["button"];
  getIndicatorProps: () => T["element"];
}

export function connectButton<T extends PropTypes>(
  service: Service<ButtonContext, ButtonProps, ButtonEvent>,
  normalize: NormalizeProps<T>,
): ButtonApi<T> {
  const { props } = service.getSnapshot();
  const disabled = Boolean(props.disabled);
  const loading = Boolean(props.loading);
  const inert = disabled || loading;
  const keepFocus = loading || Boolean(props.focusableWhenDisabled);
  const nativeDisabled = inert && !keepFocus;
  const ids = {
    ...createIds(props.id ?? "button", buttonAnatomy.parts),
    ...props.ids,
  };

  return {
    disabled,
    loading,
    press: () => {
      service.send({ type: "PRESS" });
    },
    getRootProps: () =>
      normalize.button({
        ...buttonAnatomy.root.attrs(),
        id: ids.root,
        dir: props.dir ?? "ltr",
        type: props.type ?? "button",
        name: props.name,
        value: props.value,
        form: props.form,
        disabled: nativeDisabled || undefined,
        "data-disabled": dataIf(disabled),
        "data-loading": dataIf(loading),
        "aria-disabled": inert || undefined,
        "aria-busy": loading || undefined,
        ref: (node: HTMLElement | null) => {
          service.refs.root = node;
        },
        onClick: (event?: { preventDefault?: () => void }) => {
          if (inert) {
            event?.preventDefault?.();
            return;
          }
          service.send({ type: "PRESS" });
        },
      }),
    getIndicatorProps: () =>
      normalize.element({
        ...buttonAnatomy.indicator.attrs(),
        id: ids.indicator,
        "data-loading": dataIf(loading),
        "aria-hidden": true,
      }),
  };
}
