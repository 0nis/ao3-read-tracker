import { getIdFromUrl } from "../../utils/ao3";
import { StorageService } from "../../services/storage";
import {
  ButtonAction,
  ButtonPlacement,
  WorkState,
} from "../../constants/enums";
import {
  handleEditIgnoredFicInfo,
  handleEditReadFicInfo,
  handleIgnoreFic,
  handleMarkFicAsRead,
  handleMarkFicAsUnread,
  handleUnignoreFic,
} from "./handlers";
import { el } from "../../utils/ui/dom";

interface BaseButtonConfig {
  type: WorkState;
  labels: { ON: string; OFF: string };
  placement: ButtonPlacement;
  href: string;
}

interface ToggleButtonConfig extends BaseButtonConfig {
  mode: ButtonAction.TOGGLE;
  onActivate: (id: string) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

interface ClickButtonConfig extends BaseButtonConfig {
  mode: ButtonAction.CLICK;
  onClick: (id: string) => Promise<void>;
}

type ButtonConfig = ToggleButtonConfig | ClickButtonConfig;

export async function addButton(config: ButtonConfig) {
  const parents = [];
  if (
    config.placement === ButtonPlacement.TOP ||
    config.placement === ButtonPlacement.BOTH
  ) {
    parents.push(document.querySelector("ul.work.navigation.actions"));
  }
  if (
    config.placement === ButtonPlacement.BOTTOM ||
    config.placement === ButtonPlacement.BOTH
  ) {
    const feedback = document.getElementById("feedback");
    if (feedback) parents.push(feedback.querySelector("ul.actions"));
  }

  for (const parent of parents) {
    if (parent) await createAndAppendButton(parent, config);
  }
}

async function createAndAppendButton(parent: Element, config: ButtonConfig) {
  const ficId = getIdFromUrl();
  if (!ficId) return;

  const exists = (
    config.type === WorkState.READ
      ? await StorageService.readFics.exists(ficId)
      : await StorageService.ignoredFics.exists(ficId)
  ).data;

  const button = el("a", {
    href: config.href,
    textContent: exists ? config.labels.ON : config.labels.OFF,
  });

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();

    if (config.mode === ButtonAction.TOGGLE) {
      const isOn = button.textContent === config.labels.ON;
      if (isOn) {
        button.textContent = config.labels.OFF;
        await config.onDeactivate(ficId);
      } else {
        button.textContent = config.labels.ON;
        await config.onActivate(ficId);
      }
    } else {
      await config.onClick(ficId);
    }
  });

  const li = el("li", {}, button);
  parent.appendChild(li);
}

export async function setupReadButton(
  simpleModeEnabled: boolean,
  buttonPlacement: ButtonPlacement
) {
  if (simpleModeEnabled) {
    await addButton({
      mode: ButtonAction.TOGGLE as ButtonAction.TOGGLE,
      type: WorkState.READ,
      placement: buttonPlacement,
      labels: { ON: "Mark as Unread", OFF: "Mark as Read" },
      href: "#ext-mar__read-form",
      onActivate: (id) => handleMarkFicAsRead({ id }),
      onDeactivate: handleMarkFicAsUnread,
    });
  } else {
    await addButton({
      mode: ButtonAction.CLICK as ButtonAction.CLICK,
      type: WorkState.READ,
      placement: buttonPlacement,
      labels: { ON: "Edit Read Info", OFF: "Mark as Read" },
      href: "#ext-mar__read-form",
      onClick: (id) => handleEditReadFicInfo(id),
    });
  }
}

export async function setupIgnoreButton(
  simpleModeEnabled: boolean,
  buttonPlacement: ButtonPlacement
) {
  if (simpleModeEnabled) {
    await addButton({
      mode: ButtonAction.TOGGLE as ButtonAction.TOGGLE,
      type: WorkState.IGNORED,
      placement: buttonPlacement,
      labels: { ON: "Unignore", OFF: "Ignore" },
      href: "#ext-mar__ignored-form",
      onActivate: (id) => handleIgnoreFic({ id }),
      onDeactivate: handleUnignoreFic,
    });
  } else {
    await addButton({
      mode: ButtonAction.CLICK as ButtonAction.CLICK,
      type: WorkState.IGNORED,
      placement: buttonPlacement,
      labels: { ON: "Edit Ignore Info", OFF: "Ignore" },
      href: "#ext-mar__ignored-form",
      onClick: (id) => handleEditIgnoredFicInfo(id),
    });
  }
}

export function modifyMarkForLaterButton(label: string) {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;
  const button = nav.querySelector<HTMLButtonElement>("li.mark button");
  if (!button || button.textContent !== "Mark as Read") return;
  button.textContent = label;
}
