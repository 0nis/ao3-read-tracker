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
  `;

  main.append(heading, content);
}
