import { ListRowType } from "../../../core/library/config";
import { UserOption } from "../../../core/library/types";
import { PaginatedListSectionBase } from "../../../core/library/components/list";
import { createListRow } from "../../../core/library/components/row";
import {
  InfoVisibilityOptions,
  InfoVisibilityOptionsManager,
} from "../../../core/library/helpers/managers/info-visibility";
import { getStored } from "../../../core/library/helpers/gen";
import { SectionId } from "../../../config";

import { StorageService } from "../../../../../services/storage/storage";
import { getDateParts } from "../../../../../utils/date";
import { SortDirection } from "../../../../../enums/ui";
import { ABBREVIATION } from "../../../../../constants/global";
import { IgnoredWork } from "../../../../../types/works";
import {
  EqualityFilter,
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../../types/storage";
import { SymbolId } from "../../../../../enums/symbols";
import { loadSymbolsAndRules } from "../../../core/library/helpers/row/symbols";

interface IgnoredListUserOptions extends InfoVisibilityOptions {}

const KEY = `${ABBREVIATION}.ignored-list`.toLowerCase();

class IgnoredListSection extends PaginatedListSectionBase<IgnoredWork> {
  private options: IgnoredListUserOptions = {
    showSymbols: getStored<boolean>({
      key: `${KEY}.show.symbols`,
      fallback: false,
    }),
    showNotes: getStored<boolean>({
      key: `${KEY}.show.notes`,
      fallback: true,
    }),
  };
  private infoVisManager: InfoVisibilityOptionsManager;

  constructor() {
    super({
      id: SectionId.IGNORE_LIBRARY,
      title: "Ignored Works Library",
      key: KEY,
      allowedOrderBy: ["ignoredAt"],
      defaultPaginationOptions: {
        orderBy: "ignoredAt",
        sortDirection: SortDirection.DESC,
        pageSize: 10,
      },
    });

    this.infoVisManager = new InfoVisibilityOptionsManager(
      KEY,
      this.options,
      () => this.renderPage(),
      { showNotes: "Show Reason" },
    );
  }

  protected getFilters(): EqualityFilter<IgnoredWork>[] {
    return [];
  }

  protected getCustomUserOptions = (): {
    [K in keyof IgnoredListUserOptions]: UserOption<IgnoredListUserOptions[K]>;
  } => {
    return { ...this.infoVisManager.getUserOptions() };
  };

  protected paginator = (
    args: PaginatedParams<IgnoredWork>,
  ): Promise<StorageResult<PaginatedResult<IgnoredWork>>> => {
    return StorageService.ignoredWorks.paginate(args);
  };

  protected renderItem = async (item: IgnoredWork): Promise<HTMLElement> => {
    const info = {
      date: getDateParts(item.ignoredAt),
      ...(this.options.showSymbols === true && {
        symbols: {
          ...(await loadSymbolsAndRules(item.id, {
            ignoredWork: item,
          })),
          exclude: [SymbolId.IGNORED],
        },
      }),
      ...(this.options.showNotes === true && {
        status: item.reason,
      }),
    };

    return createListRow({
      type: ListRowType.IGNORED,
      item,
      info,
    });
  };
}

export function buildIgnoredListSection() {
  return new IgnoredListSection().mount();
}
