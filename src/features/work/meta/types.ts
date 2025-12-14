export interface WorkMetaGroup {
  key: string;
  label: string;
  children: HTMLElement[] | HTMLElement;
  className?: string;
}

export interface WorkMetaDetailsListItem {
  label: string;
  value?: string;
}

export interface WorkMetaDetailsListItems {
  [key: string]: WorkMetaDetailsListItem;
}

export interface WorkMetaDetailsList {
  key: string;
  items: WorkMetaDetailsListItems;
}
