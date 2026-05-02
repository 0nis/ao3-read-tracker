import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el } from "../../../../../utils/dom";
import { handleExport } from "./handlers";

export function buildExportButton() {
  const btn = el("button", { className: `button ${CLASS_PREFIX}__button` }, [
    "Export",
  ]);
  btn.onclick = async () => await handleExport(btn);

  return el("li", { className: `${CLASS_PREFIX}__export` }, [btn]);
}
