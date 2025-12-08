import { CLASS_PREFIX } from "../../../../constants/classes";
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
import {
  createPaginationControls,
  setupPaginationEvents,
} from "../helpers/pagination";
import { getStyles } from "../style";

export const LIST_CLASS = `${CLASS_PREFIX}__list`;

export type State = { currentPage: number; totalPages?: number };

export interface UserOptions<T, K extends keyof T> {
  orderBy: K;
  pageSize: number;
  reverse: boolean;
}

export interface CustomUserOption {
  id: string;
  label: string;
  input: HTMLElement;
  onChange: (value: any) => void;
}

export interface PaginatedListSectionConfig<T, K extends keyof T>
  extends SectionConfig {
  allowedOrderBy: K[];
  defaultUserOptions: UserOptions<T, K>;
  customUserOptions?: CustomUserOption[];
}

export abstract class PaginatedListSectionBase<T, K extends keyof T> {
  protected state: State = { currentPage: 0 };
  protected container: HTMLElement | null = null;
  protected controls = createPaginationControls();

  constructor(protected config: PaginatedListSectionConfig<T, K>) {}

  protected abstract renderItem(item: T): Promise<HTMLElement>;
  protected abstract paginator(
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<T>>>;

  mount(): HTMLElement {
    injectStyles(
      `${CLASS_PREFIX}__styles--list-section`,
      getStyles(LIST_CLASS)
    );

    const section = createSectionWrapper(this.config);

    this.container = el("ul", {
      className: `${LIST_CLASS}__container`,
      role: "list",
    });

    setupPaginationEvents(this.controls, this.state, this.renderPage);

    section.appendChild(this.container);
    section.appendChild(this.controls.wrapper);

    this.renderPage(true);
    return section;
  }

  protected async renderPage(initial: boolean = false) {
    if (!this.container) return;
    this.container.classList.add(`${LIST_CLASS}__container--loading`);

    const result = await handleStorageRead<PaginatedResult<T>>(
      this.paginator({
        page: this.state.currentPage,
        pageSize: this.config.defaultUserOptions.pageSize,
        options: {
          orderBy: this.config.defaultUserOptions.orderBy,
          reverse: this.config.defaultUserOptions.reverse,
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
  }

  private async renderItems(result: PaginatedResult<T> | undefined) {
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
  }

  private updatePagination(result: PaginatedResult<T> | undefined) {
    const { page, totalPages, hasPrev, hasNext } = result ?? {
      page: 0,
      totalPages: 0,
    };

    this.state.totalPages = totalPages;
    this.controls.pageInput.value = String(page + 1);
    this.controls.pageLabel.lastChild!.textContent = totalPages.toString();
    this.controls.prevBtn.disabled = !hasPrev;
    this.controls.nextBtn.disabled = !hasNext;
  }
}
