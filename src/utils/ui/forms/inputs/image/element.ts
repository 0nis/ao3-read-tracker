import { getStyles } from "./style";
import { resizeImage } from "./helpers";
import { buildPreviewElement } from "./components/preview";
import { buildInputElement } from "./components/input";
import { buildClearButton, buildUploadButton } from "./components/buttons";

import { el, injectStyles } from "../../../dom";
import { CLASS_PREFIX } from "../../../../../constants/classes";

export const getClass = () => `${CLASS_PREFIX}__image-selector`;

export type State = { currentUrl?: string };

export type ImageOptions = {
  label: string;
  onChange?: (value: Blob | null) => void;
  defaultValue?: Blob;
  addClearButton?: boolean;
};

export function imageSelector({
  label,
  onChange,
  defaultValue,
  addClearButton = false,
}: ImageOptions): HTMLElement {
  const state: State = {};

  injectStyles(
    `${CLASS_PREFIX}__styles--image-selector`,
    getStyles(getClass())
  );

  const preview = buildPreviewElement(defaultValue, state);

  const input = buildInputElement(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const processed = await resizeImage(file, 128);
    if (onChange) onChange(processed);
    if (state.currentUrl) URL.revokeObjectURL(state.currentUrl);
    state.currentUrl = URL.createObjectURL(processed);
    preview.src = state.currentUrl;
  });

  const clearBtn = buildClearButton(() => {
    if (state.currentUrl) URL.revokeObjectURL(state.currentUrl);
    state.currentUrl = "";
    preview.src = "";
    input.value = "";
    if (onChange) onChange(null);
  });

  const uploadBtn = buildUploadButton(label, () => input.click());

  return el(
    "div",
    {
      className: getClass(),
    },
    [preview, uploadBtn, ...(addClearButton ? [clearBtn] : []), input]
  );
}
