import {
  getLocalDateString,
  getLocalDateTimeString,
} from "../../../../utils/date";
import { el } from "../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../utils/ui/forms";

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
  defaultValue: string | undefined,
  disabled: boolean = false
): HTMLInputElement => {
  return el("input", {
    type: "number",
    min,
    defaultValue,
    disabled,
  }) as HTMLInputElement;
};

export const checkbox = (
  checked: boolean = false,
  disabled: boolean = false
): HTMLInputElement => {
  return el("input", {
    type: "checkbox",
    checked,
    disabled,
  }) as HTMLInputElement;
};

export const datetime = (
  defaultValue?: Date,
  disabled: boolean = false
): HTMLInputElement => {
  return el("input", {
    type: "datetime-local",
    defaultValue: defaultValue
      ? getLocalDateTimeString(defaultValue)
      : undefined,
    disabled,
  }) as HTMLInputElement;
};

export const select = <T extends Record<string, string>>(
  enumObj: T,
  defaultValue?: T[keyof T]
): HTMLSelectElement => {
  return buildSelectFromEnum(enumObj, defaultValue);
};
