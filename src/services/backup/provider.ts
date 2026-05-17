export interface BackupMetadata {
  id: string;
  createdAt: number;
}

export interface BackupProvider {
  upload(filename: string, blob: Blob): Promise<void>;
  download(filename: string): Promise<Blob>;
  list(): Promise<BackupMetadata[]>;
}
