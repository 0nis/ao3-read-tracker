import { getClass, State } from "../element";
import { el } from "../../../../../dom";
import { CLASS_PREFIX } from "../../../../../../constants/classes";

export function buildPreviewElement(
  defaultImg: Blob | undefined,
  state: State,
): HTMLImageElement {
  const preview = el("img", {
    className: `${getClass()}-preview ${CLASS_PREFIX}__inline-image`,
    alt: "preview",
  });

  if (defaultImg) {
    state.currentUrl = URL.createObjectURL(defaultImg);
    preview.src = state.currentUrl;
  } else {
    preview.classList.add(`${CLASS_PREFIX}__hidden`);
  }

  return preview;
}
