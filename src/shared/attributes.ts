import { VerticalPlacement } from "../enums/settings";

export function getButtonOrigin(btn: HTMLElement | null): VerticalPlacement {
  const origin = btn?.getAttribute("data-origin");
  return origin === VerticalPlacement.BOTTOM
    ? VerticalPlacement.BOTTOM
    : VerticalPlacement.TOP;
}

export function setButtonOrigin(btn: HTMLElement, origin: VerticalPlacement) {
  btn.setAttribute("data-origin", origin);
}
