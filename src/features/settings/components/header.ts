import { PREFIX } from "..";
import { el } from "../../../utils/ui/dom";

export function buildHeader(extensionName: string) {
  const exportTxt = "Export your data for this extension to your files";
  const exportBtn = el(
    "button",
    {
      className: `button ${PREFIX}__button`,
      type: "button",
      title: exportTxt,
      attrs: { "aria-label": exportTxt },
    },
    ["Export"]
  );

  const importTxt = "Overwrite your current data with an exported file";
  const importBtn = el(
    "button",
    {
      className: `button ${PREFIX}__button ${PREFIX}__button--danger`,
      type: "button",
      title: importTxt,
      attrs: { "aria-label": importTxt },
    },
    ["Import"]
  );

  const clearTxt = "Clear all data stored by this extension";
  const clearBtn = el(
    "button",
    {
      className: `button ${PREFIX}__button ${PREFIX}__button--danger`,
      type: "button",
      title: clearTxt,
      attrs: { "aria-label": clearTxt },
    },
    ["Clear All Data"]
  );

  const header = el(
    "header",
    { className: `${PREFIX}__header`, attrs: { role: "banner" } },
    [
      el("h2", { className: `${PREFIX}__header__title` }, [
        `${extensionName} Settings`,
      ]),
      el("div", { className: `actions ${PREFIX}__header__actions` }, [
        exportBtn,
        importBtn,
        clearBtn,
      ]),
    ]
  );

  return { header, exportBtn, importBtn, clearBtn };
}
