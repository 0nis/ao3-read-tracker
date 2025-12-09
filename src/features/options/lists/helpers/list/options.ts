import { getListClass } from "../../base/list";
import { CustomUserOption, UserOptions } from "../../types";

import { el } from "../../../../../utils/ui/dom";
import { makeExpandable } from "../../../../../utils/ui/elements/expandable/element";
import {
  getInputValue,
  number,
  enumSelect,
  getInputElement,
} from "../../../../../utils/ui/forms";
import { SortDirection } from "../../../../../enums/ui";
import { CLASS_PREFIX } from "../../../../../constants/classes";
import { select } from "../../../../../utils/ui/forms/inputs/select";

function getOptionsClass() {
  return `${getListClass()}__options`;
}

interface OptionButtonConfig {
  defaultUserOptions: UserOptions<any>;
  allowedOrderBy: string[];
  customUserOptions: CustomUserOption[];
}

export function buildOptionButton(
  cfg: OptionButtonConfig,
  onChange: (id: string, value: unknown) => void
): HTMLElement {
  const trigger = createTrigger();
  const panel = createPanel(cfg, onChange);

  const wrapper = el("div", { className: getOptionsClass() }, [trigger, panel]);

  makeExpandable({
    trigger: trigger,
    panel: panel,
    parent: wrapper,
    alignment: "right",
  });

  return wrapper;
}

function createTrigger(): HTMLButtonElement {
  return el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${getOptionsClass()}-trigger collapsed`,
    },
    ["Options"]
  );
}

function createPanel(
  cfg: OptionButtonConfig,
  onChange?: (id: string, value: unknown) => void
): HTMLElement {
  const ul = el("ul", {
    className: `${getOptionsClass()}-panel expandable secondary`,
  });

  getOptionMeta(cfg).forEach((meta) => {
    const input = getInputElement(meta.input);
    if (!input) return;
    input.id = meta.id;
    const li = el("li", { className: `${getOptionsClass()}-item` }, [
      el(
        "label",
        {
          className: `${getOptionsClass()}-label`,
          attrs: {
            for: meta.id,
          },
        },
        [meta.label]
      ),
      meta.input,
    ]);
    ul.appendChild(li);
    input.addEventListener("input", () => {
      const value = getInputValue(input);
      meta.onChange?.(meta.id, value);
      onChange?.(meta.id, value);
    });
  });

  return ul;
}

function getOptionMeta(cfg: OptionButtonConfig): {
  id: string;
  label: string;
  input: HTMLElement;
  onChange?: (key: string, value: unknown) => void;
}[] {
  return [
    ...(cfg.allowedOrderBy.length > 1
      ? [
          {
            id: `${getOptionsClass()}--order-by`,
            label: "Order By",
            input: select({
              options: cfg.allowedOrderBy,
              defaultOption: cfg.defaultUserOptions.orderBy.toString(),
            }),
          },
        ]
      : []),
    {
      id: `${getOptionsClass()}--sort-direction`,
      label: "Sort",
      input: enumSelect(SortDirection, cfg.defaultUserOptions.sortDirection),
    },
    {
      id: `${getOptionsClass()}--page-size`,
      label: "Page Size",
      input: number("1", cfg.defaultUserOptions.pageSize.toString()),
    },
    ...cfg.customUserOptions,
  ];
}
