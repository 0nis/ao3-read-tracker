import { ApplyMarksParams } from "../apply";
import {
  IGNORED_CLASS,
  READ_CLASS,
  REREAD_WORTHY_CLASS,
  STILL_READING_CLASS,
} from "../../../../constants/classes";

export function addClasses({
  element,
  readWork,
  ignoredWork,
}: ApplyMarksParams) {
  if (readWork) element.classList.add(READ_CLASS);
  if (ignoredWork) element.classList.add(IGNORED_CLASS);
  if (readWork?.isReading) element.classList.add(STILL_READING_CLASS);
  if (readWork?.rereadWorthy) element.classList.add(REREAD_WORTHY_CLASS);
}

export function removeClasses(element: HTMLElement) {
  element.classList.remove(
    READ_CLASS,
    IGNORED_CLASS,
    REREAD_WORTHY_CLASS,
    STILL_READING_CLASS
  );
}
