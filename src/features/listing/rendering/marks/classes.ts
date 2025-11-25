import { ApplyMarksParams } from "..";
import {
  IGNORED_CLASS,
  READ_CLASS,
  REREAD_WORTHY_CLASS,
  STILL_READING_CLASS,
} from "../../../../constants/classes";

export function addClasses({ item, readWork, ignoredWork }: ApplyMarksParams) {
  if (readWork) item.classList.add(READ_CLASS);
  if (ignoredWork) item.classList.add(IGNORED_CLASS);
  if (readWork?.isReading) item.classList.add(STILL_READING_CLASS);
  if (readWork?.rereadWorthy) item.classList.add(REREAD_WORTHY_CLASS);
}

export function removeClasses(item: HTMLElement) {
  item.classList.remove(
    READ_CLASS,
    IGNORED_CLASS,
    REREAD_WORTHY_CLASS,
    STILL_READING_CLASS
  );
}
