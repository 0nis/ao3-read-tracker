import { SortDirection } from "../../../enums/ui";
import { SymbolRule } from "../../../services/rules";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../types/results";
import { SymbolData } from "../../../types/symbols";
import { SectionConfig } from "../types";

export interface UserOptions<T> {
  orderBy: keyof T;
  sortDirection: SortDirection;
  pageSize: number;
}

export interface CustomUserOption {
  id: string;
  label: string;
  input: HTMLElement;
  onChange: (value: any) => void;
}

export type State = { currentPage: number; totalPages?: number };

export interface SupplementaryRowInformation {
  date: string;
  symbols?: {
    data?: SymbolData;
    rules?: SymbolRule[];
    exclude?: string[];
  };
  text?: string;
  status?: string;
}
