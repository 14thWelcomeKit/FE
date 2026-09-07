export const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const isHeicFile = (file) =>
  /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

export const normalizeImageFile = async (file) => {
  if (isHeicFile(file)) {
    const { default: heic2any } = await import("heic2any");
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const blob = Array.isArray(result) ? result[0] : result;

    return new File(
      [blob],
      file.name.replace(/\.[^.]+$/, ".jpg"),
      { type: "image/jpeg" },
    );
  }

  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      "지원하지 않는 이미지 형식입니다. (jpeg, png, webp만 가능)",
    );
  }

  return file;
};
