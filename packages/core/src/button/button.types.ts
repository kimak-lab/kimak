import type { ButtonEvents, ButtonProps as ButtonSpecProps } from "@kimak/spec";
import type { CommonProps } from "../types";

export type { ButtonType } from "@kimak/spec";

export interface ButtonProps extends ButtonSpecProps, ButtonEvents, CommonProps {}

export interface ButtonContext {}

export type ButtonEvent = { type: "PRESS" };
