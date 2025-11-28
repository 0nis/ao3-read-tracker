import { PREFIX } from "../..";
import { el } from "../../../../utils/ui/dom";
import { handleClearData } from "./handlers";

export function buildClearDataButton() {
  const btn = el(
    "button",
    { className: `button ${PREFIX}__button ${PREFIX}__button--danger` },
    ["Clear All Data"]
  );
  btn.onclick = async () => await handleClearData(btn);

  return el("li", { className: `${PREFIX}__clear` }, [btn]);
}
