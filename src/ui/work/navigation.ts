import { getIdFromUrl } from "../../utils/ao3";
import { getTrackedFics } from "../../services/tracking";
import { STORAGE_KEYS } from "../../constants/settings";

interface ToggleButtonConfig {
  storageKey: string;
  labels: { ON: string; OFF: string };
  onActivate: (id: string) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

export async function addToggleButton(config: ToggleButtonConfig) {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;

  const ficId = getIdFromUrl();
  if (!ficId) return;

  const tracked = await getTrackedFics();
  const initialState =
    config.storageKey === STORAGE_KEYS.READ
      ? !!tracked.read[ficId]
      : !!tracked.ignored[ficId];

  const li = document.createElement("li");
  const button = document.createElement("a");
  button.href = "#";
  button.textContent = initialState ? config.labels.ON : config.labels.OFF;

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const isOn = button.textContent === config.labels.ON;

    if (isOn) {
      button.textContent = config.labels.OFF;
      await config.onDeactivate(ficId);
    } else {
      button.textContent = config.labels.ON;
      await config.onActivate(ficId);
    }
  });

  li.appendChild(button);
  nav.appendChild(li);
}
