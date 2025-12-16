import { ListRowType } from "../config";
import { FilterState, UserOption } from "../types";
import { PaginatedListSectionBase } from "../base/list";
import { createListRow } from "../base/row";
import { loadSymbolsAndRules } from "../helpers/row/symbols";
import {
  InfoVisibilityOptions,
  InfoVisibilityOptionsManager,
} from "../helpers/managers/info-visibility";
import { filtersFromState, getStored } from "../helpers/gen";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { getDateParts } from "../../../../utils/date";
import { SymbolId } from "../../../../enums/symbols";
import { SortDirection } from "../../../../enums/ui";
import { ABBREVIATION } from "../../../../constants/global";
import { InProgressWork } from "../../../../types/works";
import {
  EqualityFilter,
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/storage";
import { enumSelect } from "../../../../utils/ui/forms";
import { ReadingStatus } from "../../../../enums/works";
import { localMemory } from "../../../../services/memory";

interface InProgressListUserOptions extends InfoVisibilityOptions {
  readingStatus: string;
}

const KEY: string = `${ABBREVIATION}.in-progress-list`.toLowerCase();

// TODO: Fill filter object on initialization to load persisted values
// TODO: Fix pagination not updating on filter change (we have a bunch of empty pages)

class InProgressListSection extends PaginatedListSectionBase<InProgressWork> {
  private options: InProgressListUserOptions = {
    showSymbols: getStored<boolean>({
      key: `${KEY}.show.symbols`,
      fallback: true,
    }),
    showStatus: getStored<boolean>({
      key: `${KEY}.show.status`,
      fallback: false,
    }),
    readingStatus: getStored<string>({
      key: `${KEY}.status`,
      fallback: "all",
    }),
  };
  private filterState: FilterState<InProgressWork> = {};
  private infoVisManager: InfoVisibilityOptionsManager;

  constructor() {
    super({
      id: SectionId.IN_PROGRESS_LIST,
      title: "In Progress Works List",
      key: KEY,
      allowedOrderBy: ["lastReadAt", "startedAt"],
      defaultPaginationOptions: {
        orderBy: "lastReadAt",
        sortDirection: SortDirection.DESC,
        pageSize: 10,
      },
    });
    this.infoVisManager = new InfoVisibilityOptionsManager(
      KEY,
      this.options,
      () => this.renderPage()
    );
  }

  protected getFilters = (): EqualityFilter<InProgressWork>[] =>
    filtersFromState(this.filterState);

  protected getCustomUserOptions = (): {
    [K in keyof InProgressListUserOptions]: UserOption<
      InProgressListUserOptions[K]
    >;
  } => {
    return {
      ...this.infoVisManager.getUserOptions(),
      readingStatus: {
        label: "Status",
        input: enumSelect({ all: "all", ...ReadingStatus }),
        onChange: (value: string) => {
          this.options.readingStatus = value;
          localMemory.set(`${KEY}.status`, value);

          if (value === "all") delete this.filterState.readingStatus;
          else this.filterState.readingStatus = value as ReadingStatus;

          this.renderPage();
        },
      },
    };
  };

  protected paginator = (
    args: PaginatedParams<InProgressWork>
  ): Promise<StorageResult<PaginatedResult<InProgressWork>>> => {
    return StorageService.inProgressWorks.paginate(args);
  };

  protected renderItem = async (item: InProgressWork): Promise<HTMLElement> => {
    const info = {
      date: getDateParts(item.lastReadAt),
      ...(this.options.showSymbols === true && {
        symbols: {
          ...(await loadSymbolsAndRules(item.id, {
            inProgressWork: item,
          })),
          exclude: [
            SymbolId.IN_PROGRESS,
            ...((this.options.showStatus === true && [
              SymbolId.STATUS_READING_ACTIVE,
              SymbolId.STATUS_READING_PAUSED,
              SymbolId.STATUS_READING_WAITING,
            ]) ||
              []), // Status already shown as text
          ],
        },
      }),
      ...(this.options.showStatus === true && {
        status: item.readingStatus,
      }),
    };

    return createListRow({
      type: ListRowType.IN_PROGRESS,
      item,
      info,
    });
  };

  protected handleCustomOptionChange(key: string, value: unknown): void {}
}

export function buildInProgressListSection() {
  return new InProgressListSection().mount();
}
