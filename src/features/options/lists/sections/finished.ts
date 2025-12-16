import { ListRowType } from "../config";
import { FilterState, UserOption } from "../types";
import { PaginatedListSectionBase } from "../base/list";
import { createListRow } from "../base/row";
import { loadSymbolsAndRules } from "../helpers/row/symbols";
import { filtersFromState, getStored } from "../helpers/gen";

import {
  InfoVisibilityOptions,
  InfoVisibilityOptionsManager,
} from "../helpers/managers/info-visibility";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { getDateParts } from "../../../../utils/date";
import { SymbolId } from "../../../../enums/symbols";
import { BooleanFilterSelect, SortDirection } from "../../../../enums/ui";
import { ABBREVIATION } from "../../../../constants/global";
import { FinishedWork } from "../../../../types/works";
import {
  EqualityFilter,
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/storage";
import { enumSelect } from "../../../../utils/ui/forms";
import { FinishedStatus } from "../../../../enums/works";
import { localMemory } from "../../../../services/memory";

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
  private filterState: FilterState<FinishedWork> = {};
  private infoVisManager: InfoVisibilityOptionsManager;

  constructor() {
    super({
      id: SectionId.FINISHED_LIST,
      title: "Finished Works List",
      key: KEY,
      allowedOrderBy: ["finishedAt"],
      defaultPaginationOptions: {
        orderBy: "finishedAt",
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

  protected getFilters = (): EqualityFilter<FinishedWork>[] =>
    filtersFromState(this.filterState);

  protected getCustomUserOptions = (): {
    [K in keyof FinishedListUserOptions]: UserOption<
      FinishedListUserOptions[K]
    >;
  } => {
    return {
      ...this.infoVisManager.getUserOptions(),
      finishedStatus: {
        label: "Status",
        input: enumSelect({ all: "all", ...FinishedStatus }),
        onChange: (value: string) => {
          this.options.finishedStatus = value;
          localMemory.set(`${KEY}.status`, value);

          if (value === "all") delete this.filterState.finishedStatus;
          else this.filterState.finishedStatus = value as FinishedStatus;

          this.renderPage();
        },
      },
      rereadWorthy: {
        label: "Reread Worthy",
        input: enumSelect(BooleanFilterSelect),
        onChange: (value: string) => {
          this.options.rereadWorthy = value;
          localMemory.set(`${KEY}.reread-worthy`, value);

          if (value === "all") delete this.filterState.rereadWorthy;
          else
            this.filterState.rereadWorthy = value === BooleanFilterSelect.TRUE;

          this.renderPage();
        },
      },
    };
  };

  protected paginator = (
    args: PaginatedParams<FinishedWork>
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
              SymbolId.STATUS_ABANDONED,
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
