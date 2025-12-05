import { CLASS_PREFIX } from "../../../../../constants/classes";
import { ABBREVIATION } from "../../../../../constants/global";
import { el, injectStyles } from "../../../dom";
import { getStyles } from "./style";

const prefix = `${CLASS_PREFIX}__toggle-switch`;

export function buildToggleSwitch(
  id: string,
  options: {
    checked?: boolean;
    attrs?: Record<string, string>;
    onChange?: (checked: boolean) => void;
  }
): HTMLElement {
  const { checked = false, attrs, onChange } = options;

  injectStyles(`${prefix}--styles`, getStyles(prefix));

  const input = el(
    "input",
    {
      id,
      className: `${prefix}__input`,
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

  const slider = el("span", { className: `${prefix}__slider` }, []);
  slider.addEventListener("click", () => {
    input.click();
  });

  return el(
    "div",
    {
      className: `${prefix}`,
      attrs: {
        "input-type": `${ABBREVIATION}-toggle-switch`,
      },
    },
    [input, slider]
  );
}
