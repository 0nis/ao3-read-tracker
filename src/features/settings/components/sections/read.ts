import { PREFIX } from "../..";
import { DisplayMode } from "../../../../constants/enums";
import { el } from "../../../../utils/dom";
import { buildSelectFromEnum } from "../../../../utils/form";
import { createSection } from "./base";

export function buildReadSection(): HTMLElement {
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

  const stillReadingDisplayField = el(
    "div",
    { className: `${PREFIX}__field` },
    [
      el("label", {}, ["Still reading Display Mode"]),
      buildSelectFromEnum(DisplayMode, undefined, {
        "data-field": "stillReadingDisplayMode",
      }),
    ]
  );

  const rereadDisplayField = el("div", { className: `${PREFIX}__field` }, [
    el("label", {}, ["Reread worthy Display Mode"]),
    buildSelectFromEnum(DisplayMode, undefined, {
      "data-field": "rereadWorthyDisplayMode",
    }),
  ]);

  return createSection({
    id: "read",
    title: "Read Settings",
    fields: [
      simpleField,
      defaultDisplayField,
      stillReadingDisplayField,
      rereadDisplayField,
    ],
  });
}
