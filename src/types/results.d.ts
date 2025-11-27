export type StorageResult<T = void> = {
  data?: T;
  error?: unknown;
  success: boolean;
};

export interface PaginatedParams {
  page: number;
  pageSize: number;
  options?: {
    orderBy?: keyof T;
    reverse?: boolean;
  };
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
