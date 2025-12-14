import { ListRowType } from "../config";
import { UserOption } from "../types";
import { PaginatedListSectionBase } from "../base/list";
import { createListRow } from "../base/row";
import {
  InfoVisibilityOptions,
  InfoVisibilityOptionsManager,
} from "../helpers/managers/info-visibility";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { getFormattedDate } from "../../../../utils/date";
import { SortDirection } from "../../../../enums/ui";
import { ABBREVIATION } from "../../../../constants/global";
import { IgnoredWork } from "../../../../types/works";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { SymbolId } from "../../../../enums/symbols";
import { loadSymbolsAndRules } from "../helpers/row/symbols";

interface IgnoredListUserOptions extends InfoVisibilityOptions {}

const KEY = `${ABBREVIATION}.ignored-list`.toLowerCase();

class IgnoredListSection extends PaginatedListSectionBase<IgnoredWork> {
  private options: IgnoredListUserOptions = {
    showSymbols: this.getStored<boolean>({
      key: `${KEY}.show.symbols`,
      fallback: false,
    }),
    showNotes: this.getStored<boolean>({
      key: `${KEY}.show.notes`,
      fallback: true,
    }),
  };
  private infoVisManager: InfoVisibilityOptionsManager;

  constructor() {
    super({
      id: SectionId.IGNORE_LIST,
      title: "Ignored Works List",
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
      () => this.renderPage()
    );
  }

  protected getCustomUserOptions = (): {
    [K in keyof IgnoredListUserOptions]: UserOption<IgnoredListUserOptions[K]>;
  } => {
    return { ...this.infoVisManager.getUserOptions() };
  };

  protected paginator = (
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<IgnoredWork>>> => {
    return StorageService.ignoredWorks.paginate(args);
  };

  protected renderItem = async (item: IgnoredWork): Promise<HTMLElement> => {
    const info = {
      date: getFormattedDate(item.ignoredAt, "/"),
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
