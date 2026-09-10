export const TARGET_BYTES = 3.8 * 1024 * 1024;

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|bmp)$/i;

export function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXT.test(file.name);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("无法压缩这张照片"));
      },
      "image/jpeg",
      quality,
    );
  });
}

function draw(image: ImageBitmap | HTMLImageElement, scale: number) {
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("浏览器无法处理图片");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
}

async function loadBitmap(file: File) {
  try {
    return await createImageBitmap(file);
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("无法读取这张照片"));
        img.src = url;
      });
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function jpegName(name: string) {
  return name.replace(/\.[^.]+$/, "") + ".jpg";
}

export async function compressToLimit(
  file: File,
  maxBytes = TARGET_BYTES,
): Promise<File> {
  if (file.size <= maxBytes) return file;

  const image = await loadBitmap(file);
  try {
    const longest = Math.max(image.width, image.height);
    let scale = longest > 3600 ? 3600 / longest : 1;
    let quality = 0.86;
    let best: Blob | null = null;

    for (let step = 0; step < 14; step += 1) {
      const canvas = draw(image, scale);
      const blob = await canvasToJpeg(canvas, quality);
      best = blob;
      if (blob.size <= maxBytes) {
        return new File([blob], jpegName(file.name), { type: "image/jpeg" });
      }
      if (quality > 0.52) {
        quality = Math.max(0.5, quality - 0.08);
      } else {
        scale *= 0.82;
        quality = 0.78;
      }
      if (image.width * scale < 720 && image.height * scale < 720) break;
    }

    if (!best) throw new Error("压缩失败");
    if (best.size > maxBytes) {
      throw new Error("压缩后仍超过 4MB，请换一张更小的图");
    }
    return new File([best], jpegName(file.name), { type: "image/jpeg" });
  } finally {
    if ("close" in image && typeof image.close === "function") image.close();
  }
}
