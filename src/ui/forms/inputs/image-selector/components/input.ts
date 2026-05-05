import { getClass } from "../element";
import { el } from "../../../../../utils/dom";
import { CLASS_PREFIX } from "../../../../../constants/classes";

export function buildInputElement(
  accept: string,
  onChange: (value: File) => void,
): HTMLInputElement {
  const input = el("input", {
    type: "file",
    accept,
    multiple: false,
    className: `${CLASS_PREFIX}__hidden ${getClass()}-input`,
    tabIndex: -1,
    attrs: { "aria-hidden": "true" },
  });

  input.addEventListener("change", async (e) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    onChange(target.files[0]);
  });

  return input;
}
