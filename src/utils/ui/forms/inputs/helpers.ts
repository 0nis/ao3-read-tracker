import { el } from "../../dom";
import { getLocalDateTimeString } from "../../../date";

export const text = ({
  defaultValue,
  placeholder,
  disabled = false,
}: {
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
}): HTMLInputElement => {
  return el("input", {
    type: "text",
    defaultValue,
    placeholder,
    disabled,
  }) as HTMLInputElement;
};

export const textarea = ({
  rows,
  disabled = false,
}: {
  rows: number;
  disabled?: boolean;
}): HTMLTextAreaElement => {
  return el("textarea", {
    rows,
    disabled,
  }) as HTMLTextAreaElement;
};

export const number = ({
  defaultValue,
  min = 0,
  disabled = false,
}: {
  defaultValue?: number;
  min?: number;
  disabled?: boolean;
}): HTMLInputElement => {
  return el("input", {
    type: "number",
    min: String(min),
    defaultValue: defaultValue ? String(defaultValue) : undefined,
    disabled,
  }) as HTMLInputElement;
};

export const checkbox = ({
  checked = false,
  disabled = false,
}: {
  checked?: boolean;
  disabled?: boolean;
}): HTMLInputElement => {
  return el("input", {
    type: "checkbox",
    checked,
    disabled,
  }) as HTMLInputElement;
};

export const datetime = ({
  defaultValue,
  disabled = false,
}: {
  defaultValue?: Date;
  disabled?: boolean;
}): HTMLInputElement => {
  return el("input", {
    type: "datetime-local",
    defaultValue: defaultValue
      ? getLocalDateTimeString(defaultValue)
      : undefined,
    disabled,
  }) as HTMLInputElement;
};
