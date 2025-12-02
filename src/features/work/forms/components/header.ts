import { el } from "../../../../utils/ui/dom";

export function createFormHeaderElements(
  title: string,
  heading: string,
  cancelBtn: HTMLAnchorElement
): HTMLElement[] {
  return [
    el("legend", {}, [title]),
    el("p", { className: "close actions" }, [cancelBtn]),
    el("h4", { className: "heading byline" }, [heading]),
  ];
}

export function createFormCancelElement(id: string): HTMLAnchorElement {
  return el(
    "a",
    {
      id: `${id}__close`,
      attrs: { "aria-label": "cancel" },
    },
    ["×"]
  );
}
