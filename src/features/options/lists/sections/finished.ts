import { ListRowType } from "../config";
import { UserOption } from "../types";
import { PaginatedListSectionBase } from "../base/list";
import { createListRow } from "../base/row";
import { loadSymbolsAndRules } from "../helpers/row/symbols";
import {
  InfoVisibilityOptions,
  InfoVisibilityOptionsManager,
} from "../helpers/managers/info-visibility";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { getFormattedDate } from "../../../../utils/date";
import { SymbolId } from "../../../../enums/symbols";
import { SortDirection } from "../../../../enums/ui";
import { ABBREVIATION } from "../../../../constants/global";
import { FinishedWork } from "../../../../types/works";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";

interface FinishedListUserOptions extends InfoVisibilityOptions {}

const KEY = `${ABBREVIATION}.finished-list`.toLowerCase();

class FinishedListSection extends PaginatedListSectionBase<FinishedWork> {
  private options: FinishedListUserOptions = {
    showSymbols: this.getStored<boolean>({
      key: `${KEY}.show.symbols`,
      fallback: true,
    }),
    showStatus: this.getStored<boolean>({
      key: `${KEY}.show.status`,
      fallback: false,
    }),
  };
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

  protected getCustomUserOptions = (): {
    [K in keyof FinishedListUserOptions]: UserOption<
      FinishedListUserOptions[K]
    >;
  } => {
    return { ...this.infoVisManager.getUserOptions() };
  };

  protected paginator = (
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<FinishedWork>>> => {
    return StorageService.finishedWorks.paginate(args);
  };

  protected renderItem = async (item: FinishedWork): Promise<HTMLElement> => {
    const info = {
      date: getFormattedDate(item.finishedAt, "/"),
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
