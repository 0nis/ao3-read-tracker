import { getClass } from "../section";
import { SymbolRecord } from "../../../../../types/symbols";
import { el } from "../../../../../utils/ui/dom";

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

export function modifyNotification(
  type: "success" | "error",
  message: string,
  notificationEl: HTMLElement
) {
  let counter = Number(notificationEl.dataset.count ?? 1);

  if (notificationEl.textContent?.startsWith(message)) counter++;
  else counter = 1;

  notificationEl.dataset.count = String(counter);

  notificationEl.classList.remove(`${getClass()}__block-notification--success`);
  notificationEl.classList.remove(`${getClass()}__block-notification--error`);

  if (type === "success") {
    notificationEl.classList.add(`${getClass()}__block-notification--success`);
  } else if (type === "error") {
    notificationEl.classList.add(`${getClass()}__block-notification--error`);
  }

  // Timeout to make "polite" actually work for SR users
  setTimeout(() => {
    notificationEl.textContent = message;
    if (counter > 1)
      notificationEl.appendChild(el("span", {}, [` (x${counter})`]));
  }, 100);
}
