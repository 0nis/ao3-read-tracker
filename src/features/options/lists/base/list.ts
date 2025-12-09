import { CLASS_PREFIX } from "../../../../constants/classes";
import { SortDirection } from "../../../../enums/ui";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { handleStorageRead } from "../../../../utils/storage";
import { reportSrLive } from "../../../../utils/ui/accessibility";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { createSectionWrapper } from "../../components/section";
import { SectionConfig } from "../../types";
import { buildOptionButton } from "../helpers/list/options";
import {
  createPaginationControls,
  setupPaginationEvents,
} from "../helpers/list/pagination";
import { getStyles } from "../style";

export const LIST_CLASS = `${CLASS_PREFIX}__list`;

export type State = { currentPage: number; totalPages?: number };

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

export interface PaginatedListSectionConfig<T> extends SectionConfig {
  allowedOrderBy: (keyof T)[];
  defaultUserOptions: UserOptions<T>;
  customUserOptions?: CustomUserOption[];
}

export abstract class PaginatedListSectionBase<T> {
  protected state: State = { currentPage: 0 };
  protected userOptions: UserOptions<T>;
  protected container: HTMLElement;
  protected controls = createPaginationControls();

  constructor(protected config: PaginatedListSectionConfig<T>) {
    this.config = config;
    this.userOptions = { ...config.defaultUserOptions };
    this.container = el("ul", {
      className: `${LIST_CLASS}__container`,
      role: "list",
    });
  }

  protected abstract renderItem(item: T): Promise<HTMLElement>;
  protected abstract paginator(
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<T>>>;

  mount(): HTMLElement {
    injectStyles(
      `${CLASS_PREFIX}__styles--list-section`,
      getStyles(LIST_CLASS)
    );

    const section = createSectionWrapper({
      ...this.config,
      headerChildren: [
        buildOptionButton(
          {
            defaultUserOptions: this.config.defaultUserOptions,
            allowedOrderBy: this.config.allowedOrderBy.map((v) => String(v)),
            customUserOptions: this.config.customUserOptions || [],
          },
          this.handleOptionsChange
        ),
      ],
    });

    setupPaginationEvents(this.controls, this.state, this.renderPage);

    section.appendChild(this.container);
    section.appendChild(this.controls.wrapper);

    this.renderPage(true);
    return section;
  }

  protected renderPage = async (initial: boolean = false) => {
    if (!this.container) return;
    this.container.classList.add(`${LIST_CLASS}__container--loading`);

    const result = await handleStorageRead<PaginatedResult<T>>(
      this.paginator({
        page: this.state.currentPage,
        // TODO: This can be undefined at the moment, which throws. Prevent it from throwing.
        pageSize: this.userOptions.pageSize,
        options: {
          orderBy: this.userOptions.orderBy,
          reverse: this.userOptions.sortDirection === SortDirection.DESC,
        },
      }),
      { errorMsg: `Failed to fetch paginated data for ${this.config.title}.` }
    );

    await this.renderItems(result);
    this.updatePagination(result);

    queueMicrotask(() =>
      this.container!.classList.remove(`${LIST_CLASS}__container--loading`)
    );

    if (!initial && result)
      reportSrLive(`Page ${result.page + 1} of ${result.totalPages}`);
  };

  protected handleOptionsChange = (id: string, value: unknown) => {
    switch (id) {
      case `${LIST_CLASS}__options--order-by`:
        this.userOptions.orderBy = value as keyof T;
        break;
      case `${LIST_CLASS}__options--sort-direction`:
        this.userOptions.sortDirection = value as SortDirection;
        break;
      case `${LIST_CLASS}__options--page-size`:
        this.userOptions.pageSize = Number(value);
        this.state.currentPage = 0;
        break;
      default:
        break;
    }

    this.renderPage();
  };

  private renderItems = async (result: PaginatedResult<T> | undefined) => {
    if (!this.container) return;

    const fragment = document.createDocumentFragment();

    if (!result || result.items.length === 0) {
      fragment.appendChild(
        el("li", { className: `${LIST_CLASS}__row--empty` }, [
          "No items to display :(",
        ])
      );
    } else {
      const rendered = await Promise.all(
        result.items.map((i) => this.renderItem(i))
      );
      rendered.forEach((el) => fragment.appendChild(el));
    }

    this.container.replaceChildren(fragment);
  };

  private updatePagination = async (result: PaginatedResult<T> | undefined) => {
    const { page, totalPages, hasPrev, hasNext } = result ?? {
      page: 0,
      totalPages: 0,
    };

    this.state.totalPages = totalPages;
    this.controls.pageInput.value = String(page + 1);
    this.controls.pageLabel.lastChild!.textContent = totalPages.toString();
    this.controls.prevBtn.disabled = !hasPrev;
    this.controls.nextBtn.disabled = !hasNext;
  };
}
