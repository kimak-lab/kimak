"use client";

import { createContext, useContext, useId, type ComponentProps } from "react";
import {
  connectButton,
  createButtonMachine,
  splitProps,
  type ButtonApi,
  type ButtonProps as CoreButtonProps,
  type Direction,
} from "@kimak/core";
import { mergeProps } from "../merge-props";
import { normalizeProps, type ReactPropTypes } from "../normalize-props";
import { Primitive } from "../primitive";
import { useDirection } from "../direction";
import { useMachine } from "../use-machine";
import type { WithRender } from "../use-render";

type ReactButtonApi = ButtonApi<ReactPropTypes>;

const ButtonContext = createContext<ReactButtonApi | null>(null);

function useButtonApi(): ReactButtonApi {
  const api = useContext(ButtonContext);
  if (!api) {
    throw new Error("[kimak] Button parts must be wrapped in Button.Root");
  }
  return api;
}

const MACHINE_KEYS = [
  "disabled",
  "loading",
  "focusableWhenDisabled",
  "type",
  "name",
  "value",
  "form",
  "dir",
  "ids",
  "onPress",
  "getRootNode",
] as const;

export interface ButtonRootProps
  extends Omit<ComponentProps<"button">, "type" | "color" | "dir" | "value">,
    CoreButtonProps,
    WithRender {}

function Root({ children, render, id, ...props }: ButtonRootProps) {
  const reactId = useId();
  const [machineProps, rest] = splitProps(props, MACHINE_KEYS);
  const dir = useDirection(machineProps.dir as Direction | undefined);
  const service = useMachine(createButtonMachine, {
    ...(machineProps as CoreButtonProps),
    dir,
    id: id ?? reactId,
  });
  const api = connectButton(service, normalizeProps);
  const merged = mergeProps(api.getRootProps(), rest);

  return (
    <ButtonContext.Provider value={api}>
      <Primitive.button render={render} {...merged}>
        {children}
      </Primitive.button>
    </ButtonContext.Provider>
  );
}

function Indicator(props: WithRender<ComponentProps<"span">>) {
  const api = useButtonApi();
  const { render, ...rest } = props;
  return <Primitive.span render={render} {...mergeProps(api.getIndicatorProps(), rest)} />;
}

export const Button = {
  Root,
  Indicator,
};
