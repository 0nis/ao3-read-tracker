import { PREFIX } from "../..";
import { DisplayMode } from "../../../../constants/enums";
import { el } from "../../../../utils/dom";
import { buildSelectFromEnum } from "../../../../utils/form";
import { createSection } from "./base";

export function buildIgnoreSection(): HTMLElement {
  const simpleField = el("div", { className: `${PREFIX}__field` }, [
    el("label", {}, ["Enable Simple Mode"]),
    el("input", {
      type: "checkbox",
      attrs: { "data-field": "simpleModeEnabled" },
    }),
  ]);

  const defaultDisplayField = el("div", { className: `${PREFIX}__field` }, [
    el("label", {}, ["Default Display Mode"]),
    buildSelectFromEnum(DisplayMode, undefined, {
      "data-field": "defaultDisplayMode",
    }),
  ]);

  return createSection({
    id: "ignore",
    title: "Ignore Settings",
    fields: [simpleField, defaultDisplayField],
  });
}
