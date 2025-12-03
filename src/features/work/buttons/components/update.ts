import { getIdFromUrl } from "../../../../utils/ao3";
import { el } from "../../../../utils/ui/dom";

export function createUpdateButton(
  label: string,
  onClick: (id: string, btn: HTMLButtonElement) => Promise<void>
): HTMLButtonElement {
  const button = el("button", {
    textContent: label,
  });

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const id = getIdFromUrl();
    if (!id) return;
    await onClick(id, button);
  });

  return button;
}
