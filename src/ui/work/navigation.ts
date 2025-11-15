import { getIdFromUrl } from "../../utils/ao3";
import { StorageService } from "../../services/storage";
import { ButtonAction, WorkState } from "../../types/enums";

interface BaseButtonConfig {
  type: WorkState;
  labels: { ON: string; OFF: string };
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
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;

  const ficId = getIdFromUrl();
  if (!ficId) return;

  const exists = (
    config.type === WorkState.READ
      ? await StorageService.readFics.exists(ficId)
      : await StorageService.ignoredFics.exists(ficId)
  ).data;

  const li = document.createElement("li");
  const button = document.createElement("a");
  button.href = "#";
  button.textContent = exists ? config.labels.ON : config.labels.OFF;

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

  li.appendChild(button);
  nav.appendChild(li);
}
