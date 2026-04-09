import { ListRowType } from "../../../core/library/config";
import { FilterState, UserOption } from "../../../core/library/types";
import { PaginatedListSectionBase } from "../../../core/library/components/list";
import { createListRow } from "../../../core/library/components/row";
import { loadSymbolsAndRules } from "../../../core/library/helpers/row/symbols";
import { filtersFromState, getStored } from "../../../core/library/helpers/gen";

import {
  InfoVisibilityOptions,
  InfoVisibilityOptionsManager,
} from "../../../core/library/helpers/managers/info-visibility";
import { SectionId } from "../../../config";

import { StorageService } from "../../../../../services/storage/storage";
import { getDateParts } from "../../../../../utils/date";
import { SymbolId } from "../../../../../enums/symbols";
import { BooleanFilterSelect, SortDirection } from "../../../../../enums/ui";
import { ABBREVIATION } from "../../../../../constants/global";
import { FinishedWork } from "../../../../../types/works";
import {
  EqualityFilter,
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../../types/storage";
import { enumSelect } from "../../../../../utils/ui/forms";
import { FinishedStatus } from "../../../../../enums/works";
import { localMemory } from "../../../../../services/memory";

interface FinishedListUserOptions extends InfoVisibilityOptions {
  finishedStatus: string;
  rereadWorthy: string;
}

const KEY = `${ABBREVIATION}.finished-list`.toLowerCase();

class FinishedListSection extends PaginatedListSectionBase<FinishedWork> {
  private options: FinishedListUserOptions = {
    showSymbols: getStored<boolean>({
      key: `${KEY}.show.symbols`,
      fallback: true,
    }),
    showStatus: getStored<boolean>({
      key: `${KEY}.show.status`,
      fallback: false,
    }),
    finishedStatus: getStored<string>({
      key: `${KEY}.status`,
      fallback: "all",
    }),
    rereadWorthy: getStored<string>({
      key: `${KEY}.reread-worthy`,
      fallback: BooleanFilterSelect.ALL,
    }),
  };
  private infoVisManager: InfoVisibilityOptionsManager;

  constructor() {
    super({
      id: SectionId.FINISHED_LIBRARY,
      title: "Finished Works Library",
      key: KEY,
      allowedOrderBy: ["finishedAt", "timesRead"],
      defaultPaginationOptions: {
        orderBy: "finishedAt",
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

  protected getFilters = (): EqualityFilter<FinishedWork>[] => {
    const state: FilterState<FinishedWork> = {};

    if (this.options.finishedStatus !== "all")
      state.finishedStatus = this.options.finishedStatus as FinishedStatus;

    if (this.options.rereadWorthy !== BooleanFilterSelect.ALL)
      state.rereadWorthy =
        this.options.rereadWorthy === BooleanFilterSelect.TRUE;

    return filtersFromState(state);
  };

  protected getCustomUserOptions = (): {
    [K in keyof FinishedListUserOptions]: UserOption<
      FinishedListUserOptions[K]
    >;
  } => {
    return {
      ...this.infoVisManager.getUserOptions(),
      finishedStatus: {
        label: "Status",
        input: enumSelect(
          { all: "all", ...FinishedStatus },
          this.options.finishedStatus,
        ),
        onChange: (value: string) => {
          this.options.finishedStatus = value;
          localMemory.set(`${KEY}.status`, value);
          this.renderPage();
        },
      },
      rereadWorthy: {
        label: "Reread Worthy",
        input: enumSelect(
          BooleanFilterSelect,
          this.options.rereadWorthy as BooleanFilterSelect,
        ),
        onChange: (value: string) => {
          this.options.rereadWorthy = value;
          localMemory.set(`${KEY}.reread-worthy`, value);
          this.renderPage();
        },
      },
    };
  };

  protected paginator = (
    args: PaginatedParams<FinishedWork>,
  ): Promise<StorageResult<PaginatedResult<FinishedWork>>> => {
    return StorageService.finishedWorks.paginate(args);
  };

  protected renderItem = async (item: FinishedWork): Promise<HTMLElement> => {
    const info = {
      date: getDateParts(item.finishedAt),
      ...(this.options.showSymbols === true && {
        symbols: {
          ...(await loadSymbolsAndRules(item.id, {
            finishedWork: item,
          })),
          exclude: [
            SymbolId.FINISHED,
            ...((this.options.showStatus === true && [
              SymbolId.STATUS_COMPLETED,
              SymbolId.STATUS_DROPPED,
              SymbolId.STATUS_DORMANT,
            ]) ||
              []), // Status already shown as text
          ],
        },
      }),
      ...(this.options.showStatus === true && {
        status: item.finishedStatus,
      }),
    };

    return createListRow({
      type: ListRowType.FINISHED,
      item,
      info,
    });
  };
}

export function buildFinishedListSection() {
  return new FinishedListSection().mount();
}
