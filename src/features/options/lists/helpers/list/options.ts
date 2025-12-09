import { SortDirection } from "../../../../../enums/ui";
import { camelCaseToSentenceCase } from "../../../../../utils/misc";
import { el } from "../../../../../utils/ui/dom";
import { makeExpandable } from "../../../../../utils/ui/elements/expandable/element";
import { getInputValue, number, select } from "../../../../../utils/ui/forms";
import { CustomUserOption, LIST_CLASS, UserOptions } from "../../base/list";

function getOptionsClass() {
  return `${LIST_CLASS}__options`;
}

interface OptionButtonConfig {
  defaultUserOptions: UserOptions<any>;
  allowedOrderBy: string[];
  customUserOptions: CustomUserOption[];
}

// TODO: Style better
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
  return el("button", { className: `${getOptionsClass()}-trigger collapsed` }, [
    "Options",
  ]);
}

function createPanel(
  cfg: OptionButtonConfig,
  onChange?: (id: string, value: unknown) => void
): HTMLElement {
  const ul = el("ul", {
    className: `${getOptionsClass()}-panel expandable secondary`,
  });

  getOptionMeta(cfg).forEach((meta) => {
    meta.input.id = meta.id;
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
    meta.input.addEventListener("input", (e) => {
      const value = getInputValue(meta.input);
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
            input: createOrderBySelector(
              cfg.allowedOrderBy,
              cfg.defaultUserOptions.orderBy.toString()
            ),
          },
        ]
      : []),
    {
      id: `${getOptionsClass()}--sort-direction`,
      label: "Sort",
      input: select(SortDirection, cfg.defaultUserOptions.sortDirection),
    },
    {
      id: `${getOptionsClass()}--page-size`,
      label: "Page Size",
      input: number("1", cfg.defaultUserOptions.pageSize.toString()),
    },
    ...cfg.customUserOptions,
  ];
}

function createOrderBySelector(
  allowedOrderBy: string[],
  defaultOrderBy?: string
) {
  return el(
    "select",
    {
      className: `${LIST_CLASS}__select`,
      attrs: {
        "default-value": defaultOrderBy ? String(defaultOrderBy) : "",
      },
    },
    allowedOrderBy.map((v) => {
      return el("option", {
        value: String(v),
        textContent: camelCaseToSentenceCase(v),
      });
    })
  );
}
