import { getIdFromUrl, getTitleFromWorkPage } from "../../utils/ao3";
import { StorageService } from "../../services/storage";

interface ToggleButtonConfig {
  type: "read" | "ignored";
  labels: { ON: string; OFF: string };
  onActivate: (id: string, title?: string) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

export async function addToggleButton(config: ToggleButtonConfig) {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;

  const ficId = getIdFromUrl();
  if (!ficId) return;

  const ficTitle = getTitleFromWorkPage() || undefined;

  const initialState =
    config.type === "read"
      ? await StorageService.isRead(ficId)
      : await StorageService.isIgnored(ficId);

  if (!initialState.success) {
    console.error(
      "Failed to retrieve initial state for toggle button:",
      initialState.error
    );
    return;
  }
  if (initialState.data === undefined) return;

  const li = document.createElement("li");
  const button = document.createElement("a");
  button.href = "#";
  button.textContent = initialState.data ? config.labels.ON : config.labels.OFF;

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const isOn = button.textContent === config.labels.ON;

    if (isOn) {
      button.textContent = config.labels.OFF;
      await config.onDeactivate(ficId);
    } else {
      button.textContent = config.labels.ON;
      await config.onActivate(ficId, ficTitle);
    }
  });

  li.appendChild(button);
  nav.appendChild(li);
}
