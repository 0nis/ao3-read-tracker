export enum BackupMessageType {
  IS_AVAILABLE = "backup:is-available",
  GET_TARGET = "backup:get-target",
  DIRECT_UPLOAD = "backup:upload",
  START_UPLOAD = "backup:start-upload",
  UPLOAD_CHUNK = "backup:upload-chunk",
  LIST = "backup:list",
  DELETE = "backup:delete",
  CLEAR = "backup:clear",
}
