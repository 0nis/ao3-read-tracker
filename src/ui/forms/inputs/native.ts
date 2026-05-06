import { el } from "../../../utils/dom";
import { getLocalDateTimeString } from "../../../utils/date";
import { CLASS_PREFIX } from "../../../constants/classes";

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
    className: `${CLASS_PREFIX}__textarea`,
  }) as HTMLTextAreaElement;
};

export const number = ({
  defaultValue,
  min = 0,
  max,
  disabled = false,
}: {
  defaultValue?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}): HTMLInputElement => {
  return el("input", {
    type: "number",
    min: String(min),
    max: max ? String(max) : undefined,
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
