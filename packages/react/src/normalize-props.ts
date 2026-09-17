import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import { createNormalizer } from "@kimak/core";

export interface ReactPropTypes {
  element: HTMLAttributes<HTMLElement>;
  button: ButtonHTMLAttributes<HTMLButtonElement>;
  label: LabelHTMLAttributes<HTMLLabelElement>;
  input: InputHTMLAttributes<HTMLInputElement>;
}

export const normalizeProps = createNormalizer<ReactPropTypes>();
