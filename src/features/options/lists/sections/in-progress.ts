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
import { getDateParts } from "../../../../utils/date";
import { SymbolId } from "../../../../enums/symbols";
import { SortDirection } from "../../../../enums/ui";
import { ABBREVIATION } from "../../../../constants/global";
import { InProgressWork } from "../../../../types/works";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/storage";

interface InProgressListUserOptions extends InfoVisibilityOptions {}

const KEY: string = `${ABBREVIATION}.in-progress-list`.toLowerCase();

class InProgressListSection extends PaginatedListSectionBase<InProgressWork> {
  private options: InProgressListUserOptions = {
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
      id: SectionId.IN_PROGRESS_LIST,
      title: "In Progress Works List",
      key: KEY,
      allowedOrderBy: ["lastReadAt"],
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

  protected getCustomUserOptions = (): {
    [K in keyof InProgressListUserOptions]: UserOption<
      InProgressListUserOptions[K]
    >;
  } => {
    return { ...this.infoVisManager.getUserOptions() };
  };

  protected paginator = (
    args: PaginatedParams
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
