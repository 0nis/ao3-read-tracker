import { ApplyMarksParams } from "../apply";
import {
  IGNORED_CLASS,
  IN_PROGRESS_CLASS,
  READ_CLASS,
  REREAD_WORTHY_CLASS,
} from "../../../../constants/classes";

export function addClasses({
  element,
  readWork,
  inProgressWork,
  ignoredWork,
}: ApplyMarksParams) {
  if (readWork) element.classList.add(READ_CLASS);
  if (ignoredWork) element.classList.add(IGNORED_CLASS);
  if (inProgressWork) element.classList.add(IN_PROGRESS_CLASS);
  if (readWork?.rereadWorthy) element.classList.add(REREAD_WORTHY_CLASS);
}

export function removeClasses(element: HTMLElement) {
  element.classList.remove(
    READ_CLASS,
    IGNORED_CLASS,
    REREAD_WORTHY_CLASS,
    IN_PROGRESS_CLASS
  );
}
