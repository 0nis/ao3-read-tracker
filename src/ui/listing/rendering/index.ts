import { addText, removeText } from "./text";
import { collapse, unCollapse } from "./collapse";
import { addSymbols, removeSymbols } from "./symbols";

import { getFicStatusData } from "../handlers";
import { extractWorkIdFromListingId } from "../../../utils/ao3";
import { getOrCreateElement } from "../../../utils/dom";

import {
  READ_CLASS,
  IGNORED_CLASS,
  REREAD_WORTHY_CLASS,
  CLASS_PREFIX,
  STILL_READING_CLASS,
} from "../../../constants/classes";
import { CollapseMode, WorkState } from "../../../constants/enums";
import type { ReadFic, IgnoredFic } from "../../../types/storage";
import { unhide } from "./hide";

/**
 * Marks fics on the current listing page as read/ignored based on stored data, with their appropriate indicators.
 */
export async function markFicsOnPage(): Promise<void> {
  const { readFics, ignoredFics, items } = (await getDataAndItems()) || {};
  if (!readFics || !ignoredFics || !items) return;

  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (!id) continue;
    applyMarksToWork(item, readFics[id], ignoredFics[id]);
  }
}

/**
 * Updates fics on the current listing page to reflect any changes in their read/ignored status, adjusting indicators as needed.
 */
export async function updateFicsOnPage(): Promise<void> {
  const { readFics, ignoredFics, items } = (await getDataAndItems()) || {};
  if (!readFics || !ignoredFics || !items) return;

  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (!id) continue;

    item.classList.remove(
      READ_CLASS,
      IGNORED_CLASS,
      REREAD_WORTHY_CLASS,
      STILL_READING_CLASS
    );

    removeText(item);
    removeSymbols(item);
    unCollapse(item);
    unhide(item.id);
    applyMarksToWork(item, readFics[id], ignoredFics[id]);
  }
}

async function getDataAndItems(): Promise<
  | {
      readFics: Record<string, ReadFic>;
      ignoredFics: Record<string, IgnoredFic>;
      items: HTMLElement[];
    }
  | undefined
> {
  const { worksList, data } = await getFicStatusData();
  if (!worksList || !data) return;
  const items = Array.from(
    worksList.querySelectorAll<HTMLLIElement>("li.work")
  );
  const { readFics, ignoredFics } = data;
  return { readFics, ignoredFics, items };
}

function applyMarksToWork(
  item: HTMLElement,
  readFic: ReadFic | undefined,
  ignoredFic: IgnoredFic | undefined
) {
  createOrModifyLandmarkHeading(item);
  if (readFic) markAsRead(item, readFic);
  if (ignoredFic) markAsIgnored(item, ignoredFic);
  adjustWorkDisplay(item, !!readFic, !!ignoredFic);
}

function markAsRead(work: HTMLElement, item: ReadFic) {
  work.classList.add(READ_CLASS);
  if (item.rereadWorthy) work.classList.add(REREAD_WORTHY_CLASS);
  if (item.isReading) work.classList.add(STILL_READING_CLASS);
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
