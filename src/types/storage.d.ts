export type StorageResult<T = void> = {
  data?: T;
  error?: Error | string | unknown;
  success: boolean;
};

export type EqualityFilter<T, K extends keyof T = keyof T> = {
  field: K;
  value: T[K];
};

export interface PaginatedParams<T> {
  page: number;
  pageSize: number;
  options: {
    orderBy: keyof T;
    reverse?: boolean;
  };
  filters?: EqualityFilter<T>[];
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
