import { getStyles } from "../style";
import { State, UserOption } from "../types";
import { buildOptionButton } from "../helpers/list/options";
import {
  createPaginationControls,
  setupPaginationEvents,
} from "../helpers/list/pagination";
import { getStored } from "../helpers/gen";

import { SectionConfig } from "../../../types";
import { createSectionWrapper } from "../../components/section/component";

import { localMemory } from "../../../../../services/memory";
import { handleStorageRead } from "../../../../../shared/storage/handlers";
import { reportSrLive } from "../../../../../utils/ui/accessibility";
import { el, injectStyles } from "../../../../../utils/ui/dom";
import { SortDirection } from "../../../../../enums/ui";
import { CLASS_PREFIX } from "../../../../../constants/classes";
import {
  EqualityFilter,
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../../types/storage";
import { enumSelect, number, select } from "../../../../../utils/ui/forms";

export const getListClass = () => `${CLASS_PREFIX}__list`;

export interface PaginationUserOptions<T> {
  orderBy: keyof T;
  sortDirection: SortDirection;
  pageSize: number;
}

export interface PaginatedListSectionConfig<T> extends SectionConfig {
  key: string;
  defaultPaginationOptions: PaginationUserOptions<T>;
  allowedOrderBy: (keyof T)[];
}

export abstract class PaginatedListSectionBase<T> {
  protected state: State = { currentPage: 1 };
  protected container: HTMLElement;
  protected controls = createPaginationControls();
  protected paginationOptions: PaginationUserOptions<T>;
  protected userOptionDefinitions: Record<string, UserOption<any>> | undefined;

  constructor(protected config: PaginatedListSectionConfig<T>) {
    this.config = config;
    this.paginationOptions = this.getStoredPaginationOptions(
      this.config.defaultPaginationOptions,
    );
    this.container = el("ul", {
      className: `${getListClass()}__container`,
      role: "list",
    });
  }

  /**
   * Must be implemented by subclasses in order to decide how to render each item.
   * An item meaning a full row of the list (li element).
   */
  protected abstract renderItem(item: T): Promise<HTMLElement>;

  /**
   * Must be implemented by subclasses in order to load data.
   * Must take a {@link PaginatedParams} as an argument.
   * Must return a promise of a {@link StorageResult} of type {@link PaginatedResult}.
   * @param args
   */
  protected abstract paginator(
    args: PaginatedParams<T>,
  ): Promise<StorageResult<PaginatedResult<T>>>;

  /**
   * Returns a list of {@link EqualityFilter} objects to filter when calling {@link paginator}.
   * Warning: Could be slow to load on a large dataset, since these are not indexed.
   * If no filters are chosen, return an empty array.
   */
  protected abstract getFilters(): EqualityFilter<T>[];

  /**
   * Return a record of custom user options to be added to the options button.
   * All options logic must be handled within the subclass itself.
   * If no custom options are needed, return an empty object.
   * @returns A record with a string (key of the option) and a {@link UserOption}
   */
  protected abstract getCustomUserOptions(): Record<string, UserOption<any>>;

  /**
   * Must be called upon initialization of a new instance of this class.
   * @returns The root element of the list section
   */
  mount(): HTMLElement {
    injectStyles(
      `${CLASS_PREFIX}__styles--list-section`,
      getStyles(getListClass()),
    );

    this.userOptionDefinitions = this.buildUserOptionDefinitions();

    const section = createSectionWrapper({
      ...this.config,
      headerChildren: [
        buildOptionButton({
          userOptions: this.userOptionDefinitions,
          allowedOrderBy: this.config.allowedOrderBy.map((v) => String(v)),
        }),
      ],
    });

    setupPaginationEvents(this.controls, this.state, this.renderPage);

    section.appendChild(this.container);
    section.appendChild(this.controls.wrapper);

    this.renderPage(true);
    return section;
  }

  /**
   * Renders a page of items by calling {@link paginate} and {@link renderItem}.
   * @param initial If true, indicates that the page is being rendered for the first time (aka upon navigating to the options page)
   * Used to prevent reporting a page change to screen reader users when the page is being rendered for the first time
   */
  protected renderPage = async (initial: boolean = false) => {
    if (!this.container) return;
    this.container.classList.add(`${getListClass()}__container--loading`);

    const result = await handleStorageRead<PaginatedResult<T>>(
      this.paginator({
        page: this.state.currentPage,
        pageSize: this.paginationOptions.pageSize,
        options: {
          orderBy: this.paginationOptions.orderBy,
          reverse: this.paginationOptions.sortDirection === SortDirection.DESC,
        },
        filters: this.getFilters(),
      }),
      { errorMsg: `Failed to fetch paginated data for ${this.config.title}.` },
    );

    await this.renderItems(result);
    this.updatePagination(result);

    queueMicrotask(() =>
      this.container!.classList.remove(`${getListClass()}__container--loading`),
    );

    if (!initial && result)
      reportSrLive(`Page ${result.page} of ${result.totalPages}`);
  };

  private renderItems = async (result: PaginatedResult<T> | undefined) => {
    const fragment = document.createDocumentFragment();

    if (!result || result.items.length === 0) {
      fragment.appendChild(
        el("li", { className: `${getListClass()}__row--empty` }, [
          "No items to display :(",
        ]),
      );
    } else {
      const rendered = await Promise.all(
        result.items.map((i) => this.renderItem(i)),
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

    this.state.currentPage = page;
    this.state.totalPages = totalPages;
    this.controls.pageInput.value = String(page);
    this.controls.pageLabel.lastChild!.textContent = totalPages.toString();
    this.controls.prevBtn.disabled = !hasPrev;
    this.controls.nextBtn.disabled = !hasNext;
  };

  private getStoredPaginationOptions = (defaults: {
    [K in keyof PaginationUserOptions<T>]: PaginationUserOptions<T>[K];
  }): PaginationUserOptions<T> => {
    return {
      orderBy: getStored<keyof T>({
        key: `${this.config.key}.order-by`,
        fallback: defaults.orderBy,
        validator: (v): v is keyof T =>
          this.config.allowedOrderBy.map(String).includes(v as string),
      }),
      sortDirection: getStored<SortDirection>({
        key: `${this.config.key}.sort-direction`,
        fallback: defaults.sortDirection,
        validator: (v): v is SortDirection =>
          Object.values(SortDirection).includes(v as SortDirection),
      }),
      pageSize: getStored<number>({
        key: `${this.config.key}.page-size`,
        fallback: defaults.pageSize,
        validator: (v): v is number => !Number.isNaN(Number(v)),
      }),
    };
  };

  private buildUserOptionDefinitions = (): Record<string, UserOption<any>> => {
    const baseOptions: Record<string, UserOption<any>> = {
      orderBy: {
        label: "Order by",
        input: select({
          options: this.config.allowedOrderBy.map((v) => String(v)),
          defaultOption: String(this.paginationOptions.orderBy),
        }),
        show: this.config.allowedOrderBy.length > 1,
        onChange: (value: keyof T) => {
          this.paginationOptions.orderBy = value;
          localMemory.set(
            `${this.config.key}.order-by`,
            String(this.paginationOptions.orderBy),
          );
          this.renderPage();
        },
      },

      sortDirection: {
        label: "Sort",
        input: enumSelect(SortDirection, this.paginationOptions.sortDirection),
        onChange: (value: SortDirection) => {
          this.paginationOptions.sortDirection = value as SortDirection;
          localMemory.set(
            `${this.config.key}.sort-direction`,
            this.paginationOptions.sortDirection,
          );
          this.renderPage();
        },
      },

      pageSize: {
        label: "Page Size",
        input: number({
          min: 1,
          defaultValue: this.paginationOptions.pageSize,
        }),
        onChange: (value: number) => {
          const newSize = Number(value);
          if (!Number.isNaN(newSize)) {
            this.paginationOptions.pageSize = newSize;
            localMemory.set(
              `${this.config.key}.page-size`,
              this.paginationOptions.pageSize,
            );
          }
          this.renderPage();
        },
      },
    };

    return {
      ...baseOptions,
      ...this.getCustomUserOptions(),
    };
  };
}
