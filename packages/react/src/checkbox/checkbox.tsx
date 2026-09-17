"use client";

import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  connectCheckbox,
  createCheckboxMachine,
  splitProps,
  type CheckboxApi,
  type CheckboxProps as CoreCheckboxProps,
  type Direction,
} from "@kimak/core";
import { mergeProps } from "../merge-props";
import { normalizeProps, type ReactPropTypes } from "../normalize-props";
import { Primitive } from "../primitive";
import { useDirection } from "../direction";
import { useMachine } from "../use-machine";
import type { WithRender } from "../use-render";

type ReactCheckboxApi = CheckboxApi<ReactPropTypes>;

const CheckboxContext = createContext<ReactCheckboxApi | null>(null);

function useCheckboxApi(): ReactCheckboxApi {
  const api = useContext(CheckboxContext);
  if (!api) {
    throw new Error("[kimak] Checkbox parts must be wrapped in Checkbox.Root");
  }
  return api;
}

const MACHINE_KEYS = [
  "checked",
  "defaultChecked",
  "disabled",
  "invalid",
  "required",
  "readOnly",
  "name",
  "form",
  "value",
  "dir",
  "ids",
  "onCheckedChange",
] as const;

export interface CheckboxRootProps
  extends Omit<ComponentProps<"label">, "dir" | "color" | "defaultChecked">,
    CoreCheckboxProps,
    WithRender {}

function Root({ children, render, id, ...props }: CheckboxRootProps) {
  const reactId = useId();
  const [machineProps, rest] = splitProps(props, MACHINE_KEYS);
  const dir = useDirection(machineProps.dir as Direction | undefined);
  const service = useMachine(createCheckboxMachine, {
    ...(machineProps as CoreCheckboxProps),
    dir,
    id: id ?? reactId,
  });
  const api = connectCheckbox(service, normalizeProps);
  const merged = mergeProps(api.getRootProps(), rest);

  return (
    <CheckboxContext.Provider value={api}>
      <Primitive.label render={render} {...merged}>
        {children}
      </Primitive.label>
    </CheckboxContext.Provider>
  );
}

function Label(props: WithRender<ComponentProps<"span">>) {
  const api = useCheckboxApi();
  const { render, ...rest } = props;
  return <Primitive.span render={render} {...mergeProps(api.getLabelProps(), rest)} />;
}

function Control(props: WithRender<ComponentProps<"span">>) {
  const api = useCheckboxApi();
  const { render, ...rest } = props;
  return <Primitive.span render={render} {...mergeProps(api.getControlProps(), rest)} />;
}

function Indicator(props: WithRender<ComponentProps<"span"> & { children?: ReactNode }>) {
  const api = useCheckboxApi();
  const { render, children, ...rest } = props;
  return (
    <Primitive.span render={render} {...mergeProps(api.getIndicatorProps(), rest)}>
      {children}
    </Primitive.span>
  );
}

function HiddenInput(props: ComponentProps<"input">) {
  const api = useCheckboxApi();
  return <Primitive.input {...mergeProps(api.getHiddenInputProps(), props)} />;
}

export const Checkbox = {
  Root,
  Label,
  Control,
  Indicator,
  HiddenInput,
};
