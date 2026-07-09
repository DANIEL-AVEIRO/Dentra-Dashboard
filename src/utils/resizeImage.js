/** Client-side resize/compress for camera captures. */

export const RESIZE_PRESETS = {
  avatar: { maxSize: 512, quality: 0.88 },
  logo: { maxSize: 512, quality: 0.92 },
  checkin: { maxSize: 1280, quality: 0.82 },
  default: { maxSize: 1920, quality: 0.88 },
};

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

function scaledDimensions(width, height, maxSize) {
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }
  const ratio = Math.min(maxSize / width, maxSize / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not compress image"));
      },
      mimeType,
      quality
    );
  });
}

export async function resizeImageFile(file, presetOrOptions = "checkin") {
  if (!file || !file.type.startsWith("image/")) return file;

  const opts =
    typeof presetOrOptions === "string"
      ? RESIZE_PRESETS[presetOrOptions] || RESIZE_PRESETS.checkin
      : { ...RESIZE_PRESETS.checkin, ...presetOrOptions };

  const { maxSize, quality } = opts;
  const mimeType = "image/jpeg";

  try {
    const img = await loadImageElement(file);
    const { width, height } = scaledDimensions(img.naturalWidth, img.naturalHeight, maxSize);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, mimeType, quality);
    const baseName = (file.name || "photo").replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, {
      type: mimeType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
