import { getClass } from "../element";
import { el } from "../../../../dom";
import { CLASS_PREFIX } from "../../../../../../constants/classes";

export function buildUploadButton(
  label: string,
  onClick: () => void
): HTMLButtonElement {
  const btn = el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${getClass()}-button`,
      type: "button",
      title: "Click to select a file",
      attrs: { "aria-label": "Click to select a file" },
    },
    [label]
  );
  btn.addEventListener("click", onClick);
  return btn;
}

export function buildClearButton(onClick: () => void): HTMLButtonElement {
  const btn = el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${getClass()}-button--clear`,
      title: "Clear image selection",
      attrs: { "aria-label": "Clear image selection" },
    },
    ["Clear"]
  );
  btn.addEventListener("click", onClick);
  return btn;
}
