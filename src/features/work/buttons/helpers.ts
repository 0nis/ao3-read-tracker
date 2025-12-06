import { ACTION_HANDLER_MAP, ACTION_LABELS } from "./config";
import {
  ButtonConfig,
  ButtonAction,
  ActionButtonMeta,
  ActionLabelSet,
} from "./types";
import { createToggleButton } from "./components/toggle";
import { createOpenFormButton } from "./components/open-form";
import { handleDeleteWork, handleEditWork, handleSaveWork } from "./handlers";

import { getIdFromUrl } from "../../../utils/ao3";
import { VerticalPlacement } from "../../../enums/settings";
import { warn } from "../../../utils/extension";
import { el } from "../../../utils/ui/dom";
import { WorkAction, WorkActionEvent } from "../config";
import { CLASS_PREFIX } from "../../../constants/classes";

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
): Promise<HTMLElement | undefined> {
  const workId = getIdFromUrl();
  if (!workId) return;

  const map = ACTION_HANDLER_MAP[config.type];
  const exists = map?.storage ? (await map.storage.exists(workId)).data : false;

  let button: HTMLElement;
  if (config.mode === ButtonAction.TOGGLE)
    button = createToggleButton(workId, config, exists);
  else button = createOpenFormButton(workId, config, exists);

  return button;
}

type ButtonNavs = {
  top: Parent | null;
  bottom: Parent | null;
};

type Parent = {
  el: HTMLElement;
  placement: VerticalPlacement;
};

export function getButtonParents(
  placement: VerticalPlacement,
  nav: ButtonNavs
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

export function insertButtonIntoParent(parent: Parent, button: HTMLElement) {
  if (parent.placement === VerticalPlacement.TOP) {
    button.setAttribute("data-origin", VerticalPlacement.TOP);
    const li = el("li", {}, button);
    parent.el.appendChild(li);
  }
  if (parent.placement === VerticalPlacement.BOTTOM) {
    button.setAttribute("data-origin", VerticalPlacement.BOTTOM);
    const li = el("li", {}, button);
    const beforeEl = parent.el.querySelector("li#show_comments_link");
    if (beforeEl) parent.el.insertBefore(li, beforeEl);
    else parent.el.appendChild(li);
  }
}

export function getButtonOrigin(btn: HTMLElement | null): VerticalPlacement {
  const origin = btn?.getAttribute("data-origin");
  return origin === VerticalPlacement.BOTTOM
    ? VerticalPlacement.BOTTOM
    : VerticalPlacement.TOP;
}

export async function handleOnUpdateReadProgress(
  button: HTMLElement,
  workAction: WorkAction,
  workActionEvent: WorkActionEvent
) {
  if (workAction === WorkAction.IN_PROGRESS) {
    if (workActionEvent === WorkActionEvent.DELETE) {
      button.classList.add(`${CLASS_PREFIX}__hidden`);
      button.setAttribute("aria-hidden", "true");
    } else if (workActionEvent === WorkActionEvent.SAVE) {
      button.classList.remove(`${CLASS_PREFIX}__hidden`);
      button.removeAttribute("aria-hidden");
    }
  }
}
