import { ACTION_HANDLER_MAP, ACTION_LABELS } from "./config";
import {
  ButtonConfig,
  ButtonAction,
  ActionButtonMeta,
  ActionLabelSet,
} from "./types";
import { createToggleButton } from "./components/toggle-btn";
import { createClickButton } from "./components/click-btn";

import { getIdFromUrl } from "../../../utils/ao3";
import { ButtonPlacement } from "../../../enums/settings";
import { warn } from "../../../utils/extension/console";
import { el } from "../../../utils/ui/dom";
import { WorkAction } from "../config";
import { CLASS_PREFIX } from "../../../constants/classes";
import { handleDeleteWork, handleEditWork, handleSaveWork } from "./handlers";

let _cache: Record<WorkAction, ActionButtonMeta> | null = null;

export function buildActionButtonConfig(): Record<
  WorkAction,
  ActionButtonMeta
> {
  if (_cache) return _cache;

  _cache = Object.fromEntries(
    Object.entries(ACTION_LABELS).map(([key, labels]) => [
      key,
      makeMeta(key as WorkAction, labels),
    ])
  ) as Record<WorkAction, ActionButtonMeta>;
  return _cache as Record<WorkAction, ActionButtonMeta>;
}

function makeMeta(
  action: WorkAction,
  labels: ActionLabelSet
): ActionButtonMeta {
  return {
    simple: {
      type: action,
      mode: ButtonAction.TOGGLE,
      labels: labels.simple,
      onActivate: (id, btn) => handleSaveWork(id, action, btn),
      onDeactivate: (id, btn) => handleDeleteWork(id, action, btn),
    },
    advanced: {
      type: action,
      mode: ButtonAction.CLICK,
      labels: labels.advanced,
      href: `#${CLASS_PREFIX}__${action}-form`,
      onClick: (id, btn) => handleEditWork(id, action, btn),
    },
  };
}

export async function createActionModeButton(
  config: ButtonConfig
): Promise<HTMLAnchorElement | undefined> {
  const workId = getIdFromUrl();
  if (!workId) return;

  const map = ACTION_HANDLER_MAP[config.type];
  const exists = map?.storage ? (await map.storage.exists(workId)).data : false;

  let button: HTMLAnchorElement;
  if (config.mode === ButtonAction.TOGGLE)
    button = createToggleButton(workId, config, exists);
  else button = createClickButton(workId, config, exists);

  return button;
}

type ButtonNavs = {
  top: Parent | null;
  bottom: Parent | null;
};

type Parent = {
  el: HTMLElement;
  placement: ButtonPlacement;
};

export function getButtonParents(
  placement: ButtonPlacement,
  nav: ButtonNavs
): Parent[] {
  const parents: Parent[] = [];
  switch (placement) {
    case ButtonPlacement.BOTH:
      if (nav.top) parents.push(nav.top);
      if (nav.bottom) parents.push(nav.bottom);
      break;
    case ButtonPlacement.TOP:
      if (nav.top) parents.push(nav.top);
      break;
    case ButtonPlacement.BOTTOM:
      if (nav.bottom) parents.push(nav.bottom);
      break;
  }
  return parents;
}

export function getWorkNavBars(): ButtonNavs {
  const feedback = document.getElementById("feedback");
  const bNav = feedback?.querySelector("ul.actions");
  const tNav = document.querySelector("ul.work.navigation.actions");
  if (!tNav) warn("Top work navigation bar not found.");
  if (!bNav) warn("Bottom work navigation bar not found.");
  return {
    top: {
      el: tNav as HTMLElement,
      placement: ButtonPlacement.TOP,
    },
    bottom: {
      el: bNav as HTMLElement,
      placement: ButtonPlacement.BOTTOM,
    },
  };
}

export function insertButtonIntoParent(
  parent: Parent,
  button: HTMLAnchorElement
) {
  if (parent.placement === ButtonPlacement.TOP) {
    button.setAttribute("data-origin", ButtonPlacement.TOP);
    const li = el("li", {}, button);
    parent.el.appendChild(li);
  }
  if (parent.placement === ButtonPlacement.BOTTOM) {
    button.setAttribute("data-origin", ButtonPlacement.BOTTOM);
    const li = el("li", {}, button);
    const beforeEl = parent.el.querySelector("li#show_comments_link");
    if (beforeEl) parent.el.insertBefore(li, beforeEl);
    else parent.el.appendChild(li);
  }
}

export function getButtonOrigin(btn: HTMLElement | null): ButtonPlacement {
  const origin = btn?.getAttribute("data-origin");
  return origin === ButtonPlacement.BOTTOM
    ? ButtonPlacement.BOTTOM
    : ButtonPlacement.TOP;
}
