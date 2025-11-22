import { PREFIX } from "..";
import { el } from "../../../utils/dom";

export function buildTopbar() {
  const topbar = el("div", { className: `${PREFIX}__topbar` });
  const topbarLeft = el("div", {}, [el("strong", {}, ["Actions"])]);
  const exportBtn = el(
    "button",
    { className: `button ${PREFIX}__button`, type: "button" },
    ["Export"]
  );
  const importBtn = el(
    "button",
    { className: `button ${PREFIX}__button`, type: "button" },
    ["Import"]
  );
  const clearBtn = el(
    "button",
    {
      className: `button ${PREFIX}__button ${PREFIX}__button--danger`,
      type: "button",
    },
    ["Clear All Data"]
  );
  const right = el("div", {}, [exportBtn, importBtn, clearBtn]);
  topbar.append(topbarLeft, right);
  return { topbar, exportBtn, importBtn, clearBtn };
}
