import { getStyles } from "./style";
import { el, injectStyles } from "../../../dom";
import { CLASS_PREFIX } from "../../../../../constants/classes";

const getClass = () => `${CLASS_PREFIX}__image-selector`;

export type ImageOptions = {
  label: string;
  onChange?: (value: Blob) => void;
  defaultValue?: Blob;
};

export function imageSelector({
  label,
  onChange,
  defaultValue,
}: ImageOptions): HTMLElement {
  injectStyles(
    `${CLASS_PREFIX}__styles--image-selector`,
    getStyles(getClass())
  );

  const btn = el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${getClass()}-button`,
      type: "button",
      title: "Click to select a file.",
      attrs: { "aria-label": "Click to select a file." },
    },
    [label]
  );

  // TODO: Add constraints on size
  const input = el("input", {
    type: "file",
    accept: "image/*",
    multiple: false,
    className: `${CLASS_PREFIX}__hidden ${getClass()}-input`,
    tabIndex: -1,
    attrs: { "aria-hidden": "true" },
  });

  // TODO: Make small
  const preview = el("img", {
    className: `${getClass()}-preview`,
    attrs: { "aria-hidden": "true", role: "img" },
  });
  if (defaultValue) preview.src = URL.createObjectURL(defaultValue);

  btn.addEventListener("click", () => input.click());

  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (onChange) onChange(file);
      preview.src = URL.createObjectURL(file);
    }
  });

  return el(
    "div",
    {
      className: getClass(),
    },
    [preview, btn, input]
  );
}
