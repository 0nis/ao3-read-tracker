import {
  READ_CLASS,
  IGNORED_CLASS,
  REREAD_WORTHY_CLASS,
  CLASS_PREFIX,
} from "../../../constants/classes";
import { extractWorkIdFromListingId } from "../../../utils/ao3";
import { getFicStatusData } from "../handlers";
import { addText } from "./text";
import { collapse } from "./collapse";
import type { ReadFic, IgnoredFic } from "../../../types/storage";
import { addSymbols } from "./symbols";
import { getOrCreateElement } from "../../../utils/dom";
import { CollapseMode, WorkState } from "../../../types/enums";

export async function markFicsOnPage(): Promise<void> {
  const { worksList, data } = await getFicStatusData();
  if (!worksList || !data) return;

  const items = Array.from(
    worksList.querySelectorAll<HTMLLIElement>("li.work")
  );
  const { readFics, ignoredFics } = data;

  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (!id) continue;

    item.classList.remove(READ_CLASS, IGNORED_CLASS);

    createOrModifyLandmarkHeading(item);

    if (readFics[id]) markAsRead(item, readFics[id]);
    if (ignoredFics[id]) markAsIgnored(item, ignoredFics[id]);
    adjustWorkDisplay(item, !!readFics[id], !!ignoredFics[id]);
  }
}

function markAsRead(work: HTMLElement, item: ReadFic) {
  work.classList.add(READ_CLASS);
  if (item.reread) work.classList.add(REREAD_WORTHY_CLASS);
  addText(work, WorkState.READ, item);
  addSymbols(work, WorkState.READ, item);
}

function markAsIgnored(work: HTMLElement, item: IgnoredFic) {
  work.classList.add(IGNORED_CLASS);
  addText(work, WorkState.IGNORED, item);
  addSymbols(work, WorkState.IGNORED, item);
}

function adjustWorkDisplay(
  work: HTMLElement,
  isRead?: boolean,
  isIgnored?: boolean
) {
  // TODO: Allow modification of behavior through settings
  // Ignored works take precedence over read works for work display adjustment
  if (isIgnored) collapse(work, CollapseMode.AGGRESSIVE);
  else if (isRead) collapse(work, CollapseMode.GENTLE);
}

function createOrModifyLandmarkHeading(work: HTMLElement) {
  const heading = getOrCreateElement(
    work,
    `${CLASS_PREFIX}__text-indicator__landmark`,
    "h6"
  );
  heading.classList.add("landmark", "heading");
  heading.textContent = "Mark as Read Extension Information";
}
