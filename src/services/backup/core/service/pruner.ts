import { BackupProviderRegistry } from "./registry";
import { backupFailure, backupSuccessVoid } from "../../shared/result";
import { BackupFile, BackupResponse, BackupTarget } from "../../shared/types";
import { BackupProviderType } from "../../../../enums/backups";

export type BackupPruneInput = {
  providerType: BackupProviderType;
  target: BackupTarget;
  maxBackups?: number;
  maxAgeMs?: number;
};

export class BackupPruner {
  constructor(private readonly providers: BackupProviderRegistry) {}

  async prune({
    providerType,
    target,
    maxBackups,
    maxAgeMs,
  }: BackupPruneInput): Promise<BackupResponse<void>> {
    const hasMaxAge = typeof maxAgeMs === "number" && maxAgeMs > 0;
    const hasMaxBackups = typeof maxBackups === "number" && maxBackups > 0;

    if (!hasMaxAge && !hasMaxBackups) return backupSuccessVoid();

    const proxy = this.providers.getProxy(providerType);

    const backups = await proxy.list(target);
    if (!backups.success)
      return backupFailure(
        backups.error ?? "Could not list backups for pruning.",
      );

    if (!backups.data) return backupSuccessVoid();

    const backupsToDelete = this.getBackupsToDelete({
      backups: backups.data,
      maxBackups,
      maxAgeMs,
    });

    for (const backup of backupsToDelete) {
      const deleted = await proxy.delete(backup.id);

      if (!deleted.success)
        return backupFailure(deleted.error ?? "Could not delete backup.");
    }

    return backupSuccessVoid();
  }

  private getBackupsToDelete({
    backups,
    maxBackups,
    maxAgeMs,
  }: {
    backups: BackupFile[];
    maxBackups?: number;
    maxAgeMs?: number;
  }): BackupFile[] {
    const sorted = [...backups].sort((a, b) => b.createdAt - a.createdAt);
    const backupsToDelete = new Map<string, BackupFile>();

    if (typeof maxAgeMs === "number" && maxAgeMs > 0)
      for (const backup of sorted)
        if (this.isExpired(backup.createdAt, maxAgeMs))
          backupsToDelete.set(backup.id, backup);

    if (typeof maxBackups === "number" && maxBackups > 0)
      for (const backup of sorted.slice(maxBackups))
        backupsToDelete.set(backup.id, backup);

    return [...backupsToDelete.values()];
  }

  private isExpired(createdAt: number, maxAgeMs: number): boolean {
    return Date.now() - createdAt > maxAgeMs;
  }
}
