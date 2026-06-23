import { backupService } from "./service";

import { StorageService } from "../../storage/storage";
import { extensionStorage } from "../../extension";
import {
  BACKUP_LOCK_UNTIL_KEY,
  BACKUP_LOCK_UNTIL_MS,
} from "../shared/constants";

import { BackupProviderType } from "../../../enums/backups";
import { BackupConfig } from "../../../types/backups";
import { debug, warn } from "../../../shared/extension/logger";

type BackupFailure = {
  provider: BackupProviderType;
  error: unknown;
};

export class BackupScheduler {
  constructor() {}

  /**
   * Iterates over enabled providers that are due for an automatic backup,
   * then starts the backup process for each
   */
  async start() {
    let providers: BackupProviderType[] = [];

    try {
      if (await this.hasActiveLock()) return;
      providers = await this.getScheduledProviders();
      if (providers.length === 0) return;
      debug(
        `Automatic backup triggered for providers: ${providers.join(", ")}`,
      );
    } catch (e) {
      warn("Failed to get providers scheduled for backup: ", e);
      return;
    }

    try {
      await this.acquireLock();
      const res = await this.createBackups(providers);
      this.logFailures(res.failures);
    } catch (e) {
      warn("Something went wrong while executing scheduled backups: ", e);
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Creates backups for the given providers
   * @returns List of failed backups and their errors, if any
   */
  private async createBackups(providers: BackupProviderType[]): Promise<{
    failures: BackupFailure[];
  }> {
    const failures: BackupFailure[] = [];
    for (const providerType of providers) {
      const res = await backupService.create(providerType);
      if (!res.success)
        failures.push({ provider: providerType, error: res.error });
    }
    return { failures };
  }

  /**
   * @returns Enabled providers where the next backup is due
   */
  private async getScheduledProviders(): Promise<BackupProviderType[]> {
    const res = await StorageService.backupConfigs.get();
    if (!res.success) throw new Error(String(res.error));

    return Object.entries(res.data ?? {})
      .filter(([_, v]) => v.enabled && this.isBackupDue(v))
      .map(([k]) => k as BackupProviderType);
  }

  /**
   * Logs failures to the console as warnings
   * @param failures List of failed backups and their errors
   */
  private logFailures(failures: BackupFailure[]) {
    for (const failure of failures)
      warn(
        `Failed to create backup for provider ${failure.provider}. Error: ${failure.error}.`,
      );
  }

  /**
   * @returns True if the last backup was before the configured interval or if no backup has ever been made.
   * False if interval has not passed or was not configured.
   */
  private isBackupDue(cfg: BackupConfig): boolean {
    if (!cfg.intervalHours) return false;
    if (!cfg.lastBackedUpAt) return true;

    const intervalMs = cfg.intervalHours * 60 * 60 * 1000;
    return Date.now() - cfg.lastBackedUpAt >= intervalMs;
  }

  /**
   * @returns True if a backup is currently being created
   */
  private async hasActiveLock(): Promise<boolean> {
    const validUntil = Number(
      (await extensionStorage.get(BACKUP_LOCK_UNTIL_KEY)) ?? 0,
    );
    return validUntil > Date.now();
  }

  /**
   * Prevent backup creation for the next {@link BACKUP_LOCK_UNTIL_MS} milliseconds.
   * This is to prevent multiple sessions from creating backups at the same time.
   */
  private async acquireLock(): Promise<void> {
    await extensionStorage.set(
      BACKUP_LOCK_UNTIL_KEY,
      String(Date.now() + BACKUP_LOCK_UNTIL_MS),
    );
  }

  /**
   * Removes the lock for backup creation
   */
  private async releaseLock(): Promise<void> {
    await extensionStorage.delete(BACKUP_LOCK_UNTIL_KEY);
  }
}

export const backupScheduler = new BackupScheduler();
