import { getIdFromUrl, getTitleFromWorkPage } from "../../utils/ao3";
import { StorageService } from "../../services/storage";

interface BaseButtonConfig {
  type: "read" | "ignored";
  labels: { ON: string; OFF: string };
}

interface ToggleButtonConfig extends BaseButtonConfig {
  mode: "toggle";
  onActivate: (id: string, title: string) => Promise<void>;
  onDeactivate: (id: string, title: string) => Promise<void>;
}

interface ClickButtonConfig extends BaseButtonConfig {
  mode: "click";
  onClick: (id: string, title: string) => Promise<void>;
}

type ButtonConfig = ToggleButtonConfig | ClickButtonConfig;

export async function addButton(config: ButtonConfig) {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;

  const ficId = getIdFromUrl();
  if (!ficId) return;
  const ficTitle = getTitleFromWorkPage() || "Untitled";

  const initialState =
    config.type === "read"
      ? await StorageService.isRead(ficId)
      : await StorageService.isIgnored(ficId);

  if (!initialState.success) {
    console.error(
      "Failed to retrieve initial state for button:",
      initialState.error
    );
    return;
  }
  if (initialState.data === undefined) return;

  const li = document.createElement("li");
  const button = document.createElement("a");
  button.href = "#";
  button.textContent =
    config.mode === "toggle" && initialState.data
      ? config.labels.ON
      : config.labels.OFF;

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();

    if (config.mode === "toggle") {
      const isOn = button.textContent === config.labels.ON;
      if (isOn) {
        button.textContent = config.labels.OFF;
        await config.onDeactivate(ficId, ficTitle);
      } else {
        button.textContent = config.labels.ON;
        await config.onActivate(ficId, ficTitle);
      }
    } else {
      await config.onClick(ficId, ficTitle);
    }
  });

  li.appendChild(button);
  nav.appendChild(li);
}
