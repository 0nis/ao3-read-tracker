import { ModuleStates } from "../../types/settings";
import { WorkStateData } from "../../types/works";

/** Remove states of disabled modules */
export function cleanStates(
  states: WorkStateData,
  modules?: ModuleStates,
): WorkStateData {
  if (!modules) return states;
  return {
    finishedWork:
      states.finishedWork && modules.finishedModule.enabled
        ? states.finishedWork
        : undefined,
    inProgressWork:
      states.inProgressWork && modules.inProgressModule.enabled
        ? states.inProgressWork
        : undefined,
    ignoredWork:
      states.ignoredWork && modules.ignoredModule.enabled
        ? states.ignoredWork
        : undefined,
  };
}
