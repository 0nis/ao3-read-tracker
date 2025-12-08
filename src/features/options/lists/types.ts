import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../types/results";
import { SectionConfig } from "../types";

export interface CustomUserOption {
  id: string;
  label: string;
  input: HTMLElement;
  onChange: (value: any) => void;
}

export interface PaginatedListSectionConfig<T> extends SectionConfig {
  paginator: (
    params: PaginatedParams
  ) => Promise<StorageResult<PaginatedResult<T>>>;
  renderItem: (item: T) => Promise<HTMLElement>;
  orderBy: keyof T;
  pageSize?: number;
  reverse?: boolean;
  customUserOptions?: CustomUserOption[];
}

export type State = { currentPage: number; totalPages?: number };
