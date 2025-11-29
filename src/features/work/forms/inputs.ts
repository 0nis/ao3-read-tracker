import { el } from "../../../utils/ui/dom";

export const textarea = (
  rows: number,
  disabled: boolean = false
): HTMLTextAreaElement => {
  return el("textarea", {
    rows,
    disabled,
  }) as HTMLTextAreaElement;
};

export const number = (
  min: string,
  disabled: boolean = false
): HTMLInputElement => {
  return el("input", {
    type: "number",
    min,
    disabled,
  }) as HTMLInputElement;
};

export const checkbox = (disabled: boolean = false): HTMLInputElement => {
  return el("input", {
    type: "checkbox",
    disabled,
  }) as HTMLInputElement;
};

export const date = (disabled: boolean = false): HTMLInputElement => {
  return el("input", {
    type: "date",
    disabled,
  }) as HTMLInputElement;
};
