import { getStyles } from "./style";
import { injectStyles } from "../../../utils/dom";
import { CLASS_PREFIX } from "../../../constants/classes";

export interface ExpandableParams {
  trigger: HTMLElement;
  panel: HTMLElement;
  parent?: HTMLElement | null;
  alignment?: "left" | "right";
  initialExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

const EXPANDABLE_CLASS = `${CLASS_PREFIX}__expandable`;

/**
 * Add expand/collapse functionality to a button or element
 * @param trigger Button or element that toggles
 * @param panel Content to expand/collapse
 * @param parent Parent element to append to. If not provided, trigger.parentElement will be used. If null, then do the styling urself.
 * @param initialExpanded Initial expanded state - defaults to false
 * @param onExpand Function to call when expanded
 * @param onCollapse Function to call when collapsed
 * @returns Object with expand and collapse functions to allow for manual control
 */
export function makeExpandable({
  trigger,
  panel,
  parent = trigger.parentElement,
  alignment = "left",
  initialExpanded = false,
  onExpand,
  onCollapse,
}: ExpandableParams): {
  expand: () => void;
  collapse: () => void;
} {
  const expand = () => {
    panel.classList.remove("hidden");
    trigger.classList.remove("collapsed");
    trigger.classList.add("expanded");
    trigger.setAttribute("aria-expanded", "true");
  };

  const collapse = () => {
    panel.classList.add("hidden");
    trigger.classList.remove("expanded");
    trigger.classList.add("collapsed");
    trigger.setAttribute("aria-expanded", "false");
  };

  const isHidden = () => panel.classList.contains("hidden");

  const toggle = () => {
    if (isHidden()) {
      expand();
      onExpand?.();
    } else {
      collapse();
      onCollapse?.();
    }
  };

  injectStyles(
    `${CLASS_PREFIX}__styles--expandable`,
    getStyles(EXPANDABLE_CLASS),
  );

  if (parent) parent.classList.add(`${EXPANDABLE_CLASS}-wrapper`);
  trigger.classList.add(`${EXPANDABLE_CLASS}-trigger`);
  panel.classList.add(`${EXPANDABLE_CLASS}-panel`);

  if (alignment === "right")
    panel.classList.add(`${EXPANDABLE_CLASS}-panel--right`);
  else if (alignment === "left")
    panel.classList.add(`${EXPANDABLE_CLASS}-panel--left`);

  if (initialExpanded) expand();
  else collapse();

  trigger.addEventListener("click", toggle);

  return {
    expand: () => !isHidden() && toggle(),
    collapse: () => isHidden() && toggle(),
  };
}
