import { isResizableWithCanvas } from "../../../../file";

export async function resizeImage(file: File, maxSize = 128): Promise<Blob> {
  if (!isResizableWithCanvas(file)) return file;

  const img = new Image();
  const url = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });

  URL.revokeObjectURL(url);

  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  return await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}
