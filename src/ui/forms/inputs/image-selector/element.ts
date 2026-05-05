import { getStyles } from "./style";
import { resizeImage } from "./helpers";
import { buildPreviewElement } from "./components/preview";
import { buildInputElement } from "./components/input";
import { buildClearButton, buildUploadButton } from "./components/buttons";

import { injectStyles } from "../../../../utils/dom";
import {
  extractImageTypeNames,
  formatBytes,
  isImageFile,
} from "../../../../utils/file";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { IMAGE_PIXEL_HEIGHT, MAX_GIF_SIZE } from "../../../../constants/global";

export const getClass = () => `${CLASS_PREFIX}__image-selector`;

export type State = { currentUrl?: string };

export type ImageSelectorOptions = {
  upload?: {
    label?: HTMLElement | string;
    onClick?: () => void;
  };
  clear?: {
    label?: HTMLElement | string;
    onClick?: () => void;
  };
  defaultImg?: Blob;
  accept?: string;
  onChange?: (value: Blob | null) => void;
  onError?: (message: string) => void;
};

interface ImageSelectorElements {
  uploadBtn: HTMLButtonElement;
  clearBtn: HTMLButtonElement;
  input: HTMLInputElement;
  preview: HTMLImageElement;
}

export interface ImageSelectorResponse extends ImageSelectorElements {
  update: (file: Blob | null) => void;
}

export function getImageSelectorElements({
  upload,
  clear,
  defaultImg,
  onChange,
  onError,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/gif",
}: ImageSelectorOptions): ImageSelectorResponse {
  const state: State = {};

  injectStyles(
    `${CLASS_PREFIX}__styles--image-selector`,
    getStyles(getClass()),
  );

  const preview = buildPreviewElement(defaultImg, state);

  const update = (file: Blob | null) => {
    if (state.currentUrl) URL.revokeObjectURL(state.currentUrl);
    if (!file) {
      input.value = "";
      preview.classList.add(`${CLASS_PREFIX}__hidden`);
    } else preview.classList.remove(`${CLASS_PREFIX}__hidden`);
    state.currentUrl = file ? URL.createObjectURL(file) : undefined;
    preview.src = state.currentUrl || "";
  };

  const input = buildInputElement(accept, async (file) => {
    if (!file || !isImageFile(file)) {
      if (onError)
        onError(
          `Error: File type must be one of the following: ${extractImageTypeNames(
            accept,
          ).join(", ")}.`,
        );
      return;
    }
    if (file.type === "image/gif" && file.size > MAX_GIF_SIZE) {
      if (onError)
        onError(
          `Error: GIF files must be less than ${formatBytes(
            MAX_GIF_SIZE,
          )}. Current size: ${formatBytes(file.size)}.`,
        );
      return;
    }
    const processed = await resizeImage(file, IMAGE_PIXEL_HEIGHT);
    if (onChange) onChange(processed);
    update(processed);
  });

  const clearBtn = buildClearButton(clear?.label || "Clear", () => {
    update(null);
    if (onChange) onChange(null);
    if (clear?.onClick) clear?.onClick();
  });

  const uploadBtn = buildUploadButton(upload?.label || "Upload", () => {
    if (upload?.onClick) upload.onClick();
    input.click();
  });

  return { uploadBtn, clearBtn, input, preview, update };
}
