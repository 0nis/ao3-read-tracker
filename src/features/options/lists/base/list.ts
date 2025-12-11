import { getStyles } from "../style";
import { State, UserOption } from "../types";
import { buildOptionButton } from "../helpers/list/options";
import {
  createPaginationControls,
  setupPaginationEvents,
} from "../helpers/list/pagination";

import { SectionConfig } from "../../types";
import { createSectionWrapper } from "../../components/section";

import { handleStorageRead } from "../../../../utils/storage";
import { reportSrLive } from "../../../../utils/ui/accessibility";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { SortDirection } from "../../../../enums/ui";
import { CLASS_PREFIX } from "../../../../constants/classes";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { enumSelect, number, select } from "../../../../utils/ui/forms";

export const getListClass = () => `${CLASS_PREFIX}__list`;

export interface PaginationUserOptions<T> {
  orderBy: keyof T;
  sortDirection: SortDirection;
  pageSize: number;
}

export interface PaginatedListSectionConfig<T> extends SectionConfig {
  defaultOptions: PaginationUserOptions<T>;
  allowedOrderBy: (keyof T)[];
}

export abstract class PaginatedListSectionBase<T> {
  protected state: State = { currentPage: 0 };
  protected options: PaginationUserOptions<T>;
  protected container: HTMLElement;
  protected controls = createPaginationControls();
  protected userOptionDefinitions: Record<string, UserOption<any>>;

  constructor(protected config: PaginatedListSectionConfig<T>) {
    this.config = config;
    this.options = { ...config.defaultOptions };
    this.userOptionDefinitions = this.buildUserOptionDefinitions();
    this.container = el("ul", {
      className: `${getListClass()}__container`,
      role: "list",
    });
  }

  protected abstract renderItem(item: T): Promise<HTMLElement>;

  protected abstract paginator(
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<T>>>;

  protected abstract getCustomUserOptions(): Record<string, UserOption<any>>;

  mount(): HTMLElement {
    injectStyles(
      `${CLASS_PREFIX}__styles--list-section`,
      getStyles(getListClass())
    );

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

  protected renderPage = async (initial: boolean = false) => {
    if (!this.container) return;
    this.container.classList.add(`${getListClass()}__container--loading`);

    const result = await handleStorageRead<PaginatedResult<T>>(
      this.paginator({
        page: this.state.currentPage,
        pageSize: this.options.pageSize,
        options: {
          orderBy: this.options.orderBy,
          reverse: this.options.sortDirection === SortDirection.DESC,
        },
      }),
      { errorMsg: `Failed to fetch paginated data for ${this.config.title}.` }
    );

    await this.renderItems(result);
    this.updatePagination(result);

    queueMicrotask(() =>
      this.container!.classList.remove(`${getListClass()}__container--loading`)
    );

    if (!initial && result)
      reportSrLive(`Page ${result.page + 1} of ${result.totalPages}`);
  };

  private renderItems = async (result: PaginatedResult<T> | undefined) => {
    const fragment = document.createDocumentFragment();

    if (!result || result.items.length === 0) {
      fragment.appendChild(
        el("li", { className: `${getListClass()}__row--empty` }, [
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

  private buildUserOptionDefinitions = (): Record<string, UserOption<any>> => {
    const baseOptions: Record<string, UserOption<any>> = {
      orderBy: {
        label: "Order by",
        input: select({
          options: this.config.allowedOrderBy.map((v) => String(v)),
          defaultOption: this.options.orderBy.toString(),
        }),
        show: this.config.allowedOrderBy.length > 1,
        onChange: (value: keyof T) => {
          this.options.orderBy = value;
          this.renderPage();
        },
      },
      sortDirection: {
        label: "Sort",
        input: enumSelect(SortDirection, this.options.sortDirection),
        onChange: (value: SortDirection) => {
          this.options.sortDirection = value as SortDirection;
          this.renderPage();
        },
      },
      pageSize: {
        label: "Page Size",
        input: number("1", String(this.options.pageSize)),
        onChange: (value: number) => {
          this.options.pageSize = value;
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
