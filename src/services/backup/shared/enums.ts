export enum BackupMessageType {
  IS_AVAILABLE = "backup:is-available",
  GET_TARGET = "backup:get-target",
  DIRECT_UPLOAD = "backup:upload",
  START_UPLOAD = "BACKUP_START_UPLOAD",
  UPLOAD_CHUNK = "BACKUP_UPLOAD_CHUNK",
  LIST = "backup:list",
  DELETE = "backup:delete",
  CLEAR = "backup:clear",
}
