/** Build multipart FormData from form state (file + scalar fields). */
export function hasFilePayload(form, fields = []) {
  return fields.some((f) => f.type === "file" && form[f.name] instanceof File);
}

export function buildFormData(form, fields = []) {
  const fileKeys = new Set(
    fields.filter((f) => f.type === "file").map((f) => f.name)
  );
  const multiKeys = new Set(
    fields.filter((f) => f.type === "multiSelect").map((f) => f.name)
  );
  const fd = new FormData();

  Object.entries(form).forEach(([key, val]) => {
    if (fileKeys.has(key)) {
      if (val instanceof File) fd.append(key, val);
      return;
    }
    if (multiKeys.has(key)) {
      if (Array.isArray(val)) {
        val.forEach((id) => fd.append(key, id));
      }
      return;
    }
    if (val == null) return;
    if (typeof val === "boolean") {
      fd.append(key, val ? "true" : "false");
      return;
    }
    fd.append(key, val);
  });

  return fd;
}
