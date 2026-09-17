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
  type CheckboxApi,
  type CheckboxProps as CoreCheckboxProps,
  type Direction,
} from "@kimak/core";
import { mergeProps } from "../merge-props";
import { normalizeProps } from "../normalize-props";
import { Primitive } from "../primitive";
import { splitProps } from "../split-props";
import { useDirection } from "../direction";
import { useMachine } from "../use-machine";

const CheckboxContext = createContext<CheckboxApi | null>(null);

function useCheckboxApi(): CheckboxApi {
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
  extends Omit<ComponentProps<"label">, "dir" | "color" | "defaultChecked">, CoreCheckboxProps {
  asChild?: boolean;
}

function Root({ children, asChild, id, ...props }: CheckboxRootProps) {
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
      <Primitive.label asChild={asChild} {...merged}>
        {children}
      </Primitive.label>
    </CheckboxContext.Provider>
  );
}

function Label({ asChild, ...props }: ComponentProps<"span"> & { asChild?: boolean }) {
  const api = useCheckboxApi();
  return <Primitive.span asChild={asChild} {...mergeProps(api.getLabelProps(), props)} />;
}

function Control({ asChild, ...props }: ComponentProps<"span"> & { asChild?: boolean }) {
  const api = useCheckboxApi();
  return <Primitive.span asChild={asChild} {...mergeProps(api.getControlProps(), props)} />;
}

function Indicator({
  children,
  asChild,
  ...props
}: ComponentProps<"span"> & { asChild?: boolean; children?: ReactNode }) {
  const api = useCheckboxApi();
  return (
    <Primitive.span asChild={asChild} {...mergeProps(api.getIndicatorProps(), props)}>
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
