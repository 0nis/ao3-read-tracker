import { PREFIX } from "../..";
import { el } from "../../../../utils/ui/dom";
import { handleExport } from "../../handlers";

export function buildExportButton() {
  const btn = el(
    "button",
    {
      className: `button ${PREFIX}__button`,
      type: "button",
      attrs: {
        "aria-label": "Export your data for this extension to a file",
      },
    },
    ["Export"]
  );
  btn.onclick = async () => await handleExport(btn);

  return el("li", { className: `${PREFIX}__export` }, [btn]);
}
