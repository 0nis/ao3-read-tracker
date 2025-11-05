import { getTrackedFics } from "../../services/tracking";

const READ_CLASS = "ao3-mark-as-read__read";
const IGNORED_CLASS = "ao3-mark-as-read__ignored";

export async function markFicsOnPage() {
  const main = document.getElementById("main");
  if (!main?.classList.contains("works-index")) return;

  const ol = main.querySelector("ol.work.index.group");
  if (!ol) return;

  const items = Array.from(ol.querySelectorAll<HTMLLIElement>("li.work"));
  const tracked = await getTrackedFics();

  for (const item of items) {
    const idMatch = item.id.match(/^work_(\d+)/);
    if (!idMatch) continue;
    const id = idMatch[1];

    item.classList.remove(READ_CLASS, IGNORED_CLASS);

    if (tracked.read[id]) item.classList.add(READ_CLASS);
    if (tracked.ignored[id]) item.classList.add(IGNORED_CLASS);
  }
}
