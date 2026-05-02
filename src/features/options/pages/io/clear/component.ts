import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el } from "../../../../../utils/dom";
import { handleClearData } from "./handlers";

export function buildClearDataButton() {
  const btn = el(
    "button",
    {
      className: `button ${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--danger`,
    },
    ["Clear All Data"],
  );
  btn.onclick = async () => await handleClearData(btn);

  return el("li", { className: `${CLASS_PREFIX}__clear` }, [btn]);
}
