import { getStyles } from "./style";

import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el, injectStyles } from "../../../dom";
import { CustomInputType } from "../../../../../enums/ui";

const getClass = () => `${CLASS_PREFIX}__toggle-switch`;

export function toggleSwitch(
  id: string,
  options?: {
    checked?: boolean;
    attrs?: Record<string, string>;
    onChange?: (checked: boolean) => void;
  }
): HTMLElement {
  const { checked = false, attrs, onChange } = options || {};

  injectStyles(`${CLASS_PREFIX}__styles--toggle-switch`, getStyles(getClass()));

  const input = el(
    "input",
    {
      id,
      className: `${getClass()}__input`,
      type: "checkbox",
      checked,
      ...attrs,
    },
    []
  );
  if (onChange)
    input.addEventListener("change", (e) => {
      onChange((e.target as HTMLInputElement).checked);
    });

  const slider = el("span", { className: `${getClass()}__slider` }, []);
  slider.addEventListener("click", () => {
    input.click();
  });

  return el(
    "div",
    {
      className: `${getClass()}`,
      attrs: {
        "input-type": CustomInputType.TOGGLE_SWITCH,
      },
    },
    [input, slider]
  );
}
