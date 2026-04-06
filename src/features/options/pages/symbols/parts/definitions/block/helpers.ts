import { getClass } from "../../../section";
import { SymbolRecord } from "../../../../../../../types/symbols";
import { el } from "../../../../../../../utils/ui/dom";

export function getLabelFromType(type: keyof SymbolRecord): string {
  switch (type) {
    case "label":
      return "Label";
    case "priority":
      return "Priority";
    case "emoji":
      return "Emoji";
    case "imgBlob":
      return "Image";
  }
  return "";
}

export function setFeedback(
  type: "success" | "error",
  message: string,
  element: HTMLElement,
) {
  let counter = Number(element.dataset.count ?? 1);

  if (element.textContent?.startsWith(message)) counter++;
  else counter = 1;

  element.dataset.count = String(counter);

  element.classList.remove(`${getClass()}__block-feedback--success`);
  element.classList.remove(`${getClass()}__block-feedback--error`);

  if (type === "success") {
    element.classList.add(`${getClass()}__block-feedback--success`);
  } else if (type === "error") {
    element.classList.add(`${getClass()}__block-feedback--error`);
  }

  // Timeout to make "polite" actually work for SR users
  setTimeout(() => {
    element.textContent = message;
    if (counter > 1) element.appendChild(el("span", {}, [` (x${counter})`]));
  }, 100);
}
