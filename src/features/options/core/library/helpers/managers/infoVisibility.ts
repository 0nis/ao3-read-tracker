import { UserOption } from "../../types";
import { localMemory } from "../../../../../../services/memory";
import { toggleSwitch } from "../../../../../../ui/forms";

export interface InfoVisibilityOptions {
  showSymbols?: boolean;
  showStatus?: boolean;
  showNotes?: boolean;
}

export class InfoVisibilityOptionsManager {
  constructor(
    protected key: string,
    protected options: InfoVisibilityOptions,
    protected onChangeCallback: () => void,
    protected labels: Partial<Record<keyof InfoVisibilityOptions, string>> = {
      showSymbols: "Show Symbols",
      showStatus: "Show Status",
      showNotes: "Show Notes",
    },
  ) {}

  getUserOptions(): Partial<
    Record<keyof InfoVisibilityOptions, UserOption<any>>
  > {
    return {
      ...(this.options.showSymbols !== undefined && {
        showSymbols: {
          label: this.labels.showSymbols || "Show Symbols",
          input: toggleSwitch({ checked: this.options.showSymbols }),
          onChange: (value: boolean) => {
            this.options.showSymbols = value;
            localMemory.set(`${this.key}.show.symbols`, value);
            this.onChangeCallback();
          },
        },
      }),

      ...(this.options.showStatus !== undefined && {
        showStatus: {
          label: this.labels.showStatus || "Show Status",
          input: toggleSwitch({ checked: this.options.showStatus }),
          onChange: (value: boolean) => {
            this.options.showStatus = value;
            localMemory.set(`${this.key}.show.status`, value);
            this.onChangeCallback();
          },
        },
      }),

      ...(this.options.showNotes !== undefined && {
        showNotes: {
          label: this.labels.showNotes || "Show Notes",
          input: toggleSwitch({ checked: this.options.showNotes }),
          onChange: (value: boolean) => {
            this.options.showNotes = value;
            localMemory.set(`${this.key}.show.notes`, value);
            this.onChangeCallback();
          },
        },
      }),
    };
  }
}
