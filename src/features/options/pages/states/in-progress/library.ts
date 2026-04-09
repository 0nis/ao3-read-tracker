import { ListRowType } from "../../../core/library/config";
import { FilterState, UserOption } from "../../../core/library/types";
import { PaginatedListSectionBase } from "../../../core/library/components/list";
import { createListRow } from "../../../core/library/components/row";
import { loadSymbolsAndRules } from "../../../core/library/helpers/row/symbols";
import {
  InfoVisibilityOptions,
  InfoVisibilityOptionsManager,
} from "../../../core/library/helpers/managers/info-visibility";
import { filtersFromState, getStored } from "../../../core/library/helpers/gen";
import { SectionId } from "../../../config";

import { StorageService } from "../../../../../services/storage/storage";
import { getDateParts } from "../../../../../utils/date";
import { SymbolId } from "../../../../../enums/symbols";
import { SortDirection } from "../../../../../enums/ui";
import { ABBREVIATION } from "../../../../../constants/global";
import { InProgressWork } from "../../../../../types/works";
import {
  EqualityFilter,
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../../types/storage";
import { enumSelect } from "../../../../../utils/ui/forms";
import { ReadingStatus } from "../../../../../enums/works";
import { localMemory } from "../../../../../services/memory";

interface InProgressListUserOptions extends InfoVisibilityOptions {
  readingStatus: string;
}

const KEY: string = `${ABBREVIATION}.in-progress-list`.toLowerCase();

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
  private infoVisManager: InfoVisibilityOptionsManager;

  constructor() {
    super({
      id: SectionId.IN_PROGRESS_LIBRARY,
      title: "In Progress Works Library",
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
      () => this.renderPage(),
    );
  }

  protected getFilters = (): EqualityFilter<InProgressWork>[] => {
    const state: FilterState<InProgressWork> = {};

    if (this.options.readingStatus !== "all")
      state.readingStatus = this.options.readingStatus as ReadingStatus;

    return filtersFromState(state);
  };

  protected getCustomUserOptions = (): {
    [K in keyof InProgressListUserOptions]: UserOption<
      InProgressListUserOptions[K]
    >;
  } => {
    return {
      ...this.infoVisManager.getUserOptions(),
      readingStatus: {
        label: "Status",
        input: enumSelect(
          { all: "all", ...ReadingStatus },
          this.options.readingStatus,
        ),
        onChange: (value: string) => {
          this.options.readingStatus = value;
          localMemory.set(`${KEY}.status`, value);
          this.renderPage();
        },
      },
    };
  };

  protected paginator = (
    args: PaginatedParams<InProgressWork>,
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
