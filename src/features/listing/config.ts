import { collapse } from "./rendering/display/collapse";
import { hide } from "./rendering/display/hide";

import { DisplayMode } from "../../enums/settings";
import { CollapseMode } from "../../enums/ui";

// prettier-ignore
export const DISPLAY_MODE_MAP: Record<DisplayMode, (arg?: any) => void> = {
    [DisplayMode.COLLAPSE_GENTLE]: collapse.bind(null, CollapseMode.GENTLE),
    [DisplayMode.COLLAPSE_AGGRESSIVE]: collapse.bind(null, CollapseMode.AGGRESSIVE),
    [DisplayMode.HIDE]: hide,
    [DisplayMode.DEFAULT]: () => {},
};
