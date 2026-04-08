import { SymbolRule } from "../../../../services/rules";
import { SymbolData } from "../../../../types/symbols";

export interface UserOption<T> {
  label: string;
  input: HTMLElement;
  show?: boolean;
  onChange?: (value: T) => void;
}

export type State = { currentPage: number; totalPages?: number };

export type FilterState<T> = Partial<Record<keyof T, unknown>>;

export interface SupplementaryRowInformation {
  date: {
    year: number;
    month: number;
    day: number;
  } | null;
  symbols?: {
    data?: SymbolData;
    rules?: SymbolRule[];
    exclude?: string[];
  };
  text?: string;
  status?: string;
}
