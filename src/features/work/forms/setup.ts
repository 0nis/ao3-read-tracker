import { CLASS_PREFIX } from "../../../constants/classes";
import { injectStyles } from "../../../utils/ui/dom";
import { getFormStyles } from "./style";

export async function setupForms() {
  injectStyles(
    `${CLASS_PREFIX}__styles--work-form`,
    getFormStyles(CLASS_PREFIX)
  );
}
