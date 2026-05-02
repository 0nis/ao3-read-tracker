import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el, injectStyles } from "../../../../dom";
import { getStyles } from "./style";

export function createSpinnerLoader(): HTMLElement {
  injectStyles(
    `${CLASS_PREFIX}__spinner-loader--styles`,
    getStyles(CLASS_PREFIX),
  );
  return el("span", {
    className: `${CLASS_PREFIX}__loader`,
    attrs: {
      role: "status",
      "aria-label": "Loading",
    },
  });
}
