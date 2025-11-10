import {
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
  READ_SETTINGS_ID,
} from "../../constants/settings";
import { StorageService } from "../../services/storage";
import { hijackAo3Page } from "../../utils/ao3";

export function render(): void {
  const main = hijackAo3Page("Mark as Read - Settings", "settings-page");
  if (!main) return;

  const heading = document.createElement("h2");
  heading.classList.add("heading");
  heading.textContent = "⚙️ Mark as Read Settings";

  const content = document.createElement("div");
  content.innerHTML = `
    <p>TBD: Here you can configure your Mark as Read extension settings.</p>
    <form>
      <h1>Toggle simple mode</h1>
      <label for="simple-mode">Enable Simple Mode:</label>
      <input type="checkbox" id="simple-mode" name="simple-mode" checked>
      <p>When enabled, marking a fic as read or ignored will use default settings without prompting for additional details.</p>
      <button type="submit">Save Settings</button>
    </form>
  `;

  StorageService.settings.getById(READ_SETTINGS_ID).then((result) => {
    if (result.success && result.data) {
      const simpleModeEnabled = (result.data as any).simpleMode;
      (content.querySelector("#simple-mode") as HTMLInputElement).checked =
        simpleModeEnabled;
    }
  });

  content.addEventListener("submit", (event) => {
    event.preventDefault();
    const simpleModeEnabled = (
      document.getElementById("simple-mode") as HTMLInputElement
    ).checked;
    StorageService.settings
      .put({
        ...DEFAULT_READ_SETTINGS,
        simpleMode: simpleModeEnabled,
      })
      .then((result) => {
        if (result.success) {
          alert("Settings saved successfully.");
        }
      });
    StorageService.settings.put({
      ...DEFAULT_IGNORE_SETTINGS,
      simpleMode: simpleModeEnabled,
    });
  });
  main.append(heading, content);
}
