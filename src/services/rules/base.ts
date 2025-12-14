import type { WorkStateData } from "../../types/works";

export interface BaseRule {
  /** Determines if the rule should be applied based on current parameters. */
  shouldApply: () => boolean;
  /** Optional priority for sorting rules; higher values indicate higher priority. */
  priority?: number;
}

/**
 * Implemented by collectors that gather rules based on provided parameters.
 * Subclasses must implement {@link collect} to gather rules.
 *
 * @template Params - The type of parameters used to collect rules. Typically extends {@link WorkStateData}.
 * @template Rule - The type of rules being collected. Must extend {@link BaseRule}.
 */
export abstract class BaseRuleCollector<Params, Rule extends BaseRule> {
  /**
   * Subclasses must implement this method for rule collection logic.
   *
   * @param params - The {@link Params} needed to collect rules.
   * @returns An array of collected rules of type {@link Rule}. Each rule must define {@link Rule.shouldApply}.
   */
  public abstract collect(params: Params): Rule[];

  /**
   * Calls {@link collect} and filters the resulting rules to only those that should apply.
   * The active rules are then sorted by priority in descending order, if {@link Rule.priority} is defined.
   * The higher the priority number, the earlier the rule appears in the returned array.
   *
   * @param params - The {@link Params} needed to collect rules.
   * @returns An array of active rules of type {@link Rule}, sorted by priority.
   */
  public getActiveRules(params: Params): Rule[] {
    return this.collect(params)
      .filter((rule) => rule.shouldApply())
      .sort((a, b) => (b.priority ?? -Infinity) - (a.priority ?? -Infinity));
  }
}
