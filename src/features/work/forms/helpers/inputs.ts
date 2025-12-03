import {
  getLocalDateString,
  getLocalDateTimeString,
} from "../../../../utils/date";
import { el } from "../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../utils/ui/form";

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

export const checkbox = (disabled: boolean = false): HTMLInputElement => {
  return el("input", {
    type: "checkbox",
    disabled,
  }) as HTMLInputElement;
};

export const date = (
  defaultValue?: Date,
  disabled: boolean = false
): HTMLInputElement => {
  return el("input", {
    type: "date",
    defaultValue: defaultValue ? getLocalDateString(defaultValue) : undefined,
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
