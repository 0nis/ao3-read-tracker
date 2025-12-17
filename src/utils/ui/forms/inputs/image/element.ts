import { getStyles } from "./style";
import { resizeImage } from "./helpers";
import { buildPreviewElement } from "./components/preview";
import { buildInputElement } from "./components/input";
import { buildClearButton, buildUploadButton } from "./components/buttons";

import { injectStyles } from "../../../dom";
import { CLASS_PREFIX } from "../../../../../constants/classes";

export const getClass = () => `${CLASS_PREFIX}__image-selector`;

export type State = { currentUrl?: string };

export type ImageOptions = {
  upload?: {
    label?: HTMLElement | string;
    onClick?: () => void;
  };
  clear?: {
    label?: HTMLElement | string;
    onClick?: () => void;
  };
  defaultImg?: Blob;
  onChange?: (value: Blob | null) => void;
};

export function getImageSelectorElements({
  upload,
  onChange,
  defaultImg,
  clear,
}: ImageOptions): {
  uploadBtn: HTMLButtonElement;
  clearBtn: HTMLButtonElement;
  input: HTMLInputElement;
  preview: HTMLImageElement;
  updateCurrentUrl: (file: Blob | null) => void;
} {
  const state: State = {};

  injectStyles(
    `${CLASS_PREFIX}__styles--image-selector`,
    getStyles(getClass())
  );

  const updateCurrentUrl = (file: Blob | null) => {
    if (state.currentUrl) URL.revokeObjectURL(state.currentUrl);
    if (!file) input.value = "";
    state.currentUrl = file ? URL.createObjectURL(file) : undefined;
    preview.src = state.currentUrl || "";
  };

  const preview = buildPreviewElement(defaultImg, state);

  const input = buildInputElement(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const processed = await resizeImage(file, 128);
    if (onChange) onChange(processed);
    updateCurrentUrl(processed);
  });

  const clearBtn = buildClearButton(clear?.label || "Clear", () => {
    updateCurrentUrl(null);
    if (onChange) onChange(null);
    if (clear?.onClick) clear?.onClick();
  });

  const uploadBtn = buildUploadButton(upload?.label || "Upload", () => {
    if (upload?.onClick) upload.onClick();
    input.click();
  });

  return { uploadBtn, clearBtn, input, preview, updateCurrentUrl };
}
