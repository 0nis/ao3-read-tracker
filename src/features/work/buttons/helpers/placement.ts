import { warn } from "../../../../shared/extension/logger";
import {
  getButtonOrigin,
  setButtonOrigin,
} from "../../../../shared/attributes";
import { el } from "../../../../utils/dom";
import { VerticalPlacement } from "../../../../enums/settings";

export async function placeButtons(
  placement: VerticalPlacement,
  navs: ButtonNavs,
  create: () => Promise<HTMLElement | undefined> | HTMLElement,
) {
  if (!navs.top && !navs.bottom) return;

  const parents = getButtonParents(placement, navs);
  for (const p of parents) {
    const btn = await create();
    if (!btn) continue;
    insertButtonIntoParent(p, btn);
  }
}

export type ButtonNavs = {
  top: Parent | null;
  bottom: Parent | null;
};

type Parent = {
  el: HTMLElement;
  placement: VerticalPlacement;
};

export function getWorkNavBars(): ButtonNavs {
  const feedback = document.getElementById("feedback");
  const bNav = feedback?.querySelector("ul.actions");
  const tNav = document.querySelector("ul.work.navigation.actions");
  if (!tNav) warn("Top work navigation bar not found.");
  if (!bNav) warn("Bottom work navigation bar not found.");
  return {
    top: {
      el: tNav as HTMLElement,
      placement: VerticalPlacement.TOP,
    },
    bottom: {
      el: bNav as HTMLElement,
      placement: VerticalPlacement.BOTTOM,
    },
  };
}

function getButtonParents(
  placement: VerticalPlacement,
  nav: ButtonNavs,
): Parent[] {
  const parents: Parent[] = [];
  switch (placement) {
    case VerticalPlacement.BOTH:
      if (nav.top) parents.push(nav.top);
      if (nav.bottom) parents.push(nav.bottom);
      break;
    case VerticalPlacement.TOP:
      if (nav.top) parents.push(nav.top);
      break;
    case VerticalPlacement.BOTTOM:
      if (nav.bottom) parents.push(nav.bottom);
      break;
  }
  return parents;
}

function insertButtonIntoParent(parent: Parent, button: HTMLElement) {
  if (parent.placement === VerticalPlacement.TOP) {
    setButtonOrigin(button, VerticalPlacement.TOP);
    const li = el("li", {}, button);
    parent.el.appendChild(li);
  }
  if (parent.placement === VerticalPlacement.BOTTOM) {
    setButtonOrigin(button, VerticalPlacement.BOTTOM);
    const li = el("li", {}, button);
    const beforeEl = parent.el.querySelector("li#show_comments_link");
    if (beforeEl) parent.el.insertBefore(li, beforeEl);
    else parent.el.appendChild(li);
  }
}

export const getBtnOrigin = (btn: HTMLElement | null | undefined) => {
  return btn ? getButtonOrigin(btn) : VerticalPlacement.TOP;
};
