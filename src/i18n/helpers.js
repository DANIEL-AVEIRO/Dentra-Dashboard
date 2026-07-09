/** Translate table columns — uses labelKey or fields.{key} */
export function translateColumns(columns, t) {
  return columns.map((col) => ({
    ...col,
    label: col.labelKey
      ? t(col.labelKey)
      : col.label != null && col.label !== ""
        ? col.label
        : t(`fields.${col.key}`, { defaultValue: col.key }),
  }));
}

/** Translate form field configs */
export function translateFields(fields, t) {
  return fields.map((f) => ({
    ...f,
    label: f.labelKey
      ? t(f.labelKey)
      : t(`fields.${f.name}`, { defaultValue: f.label ?? f.name }),
    description: f.descriptionKey
      ? t(f.descriptionKey)
      : f.description
        ? t(`fields.${f.name}Desc`, { defaultValue: f.description })
        : undefined,
    helperText: f.helperTextKey
      ? t(f.helperTextKey)
      : f.helperText
        ? t(`fields.${f.name}Help`, { defaultValue: f.helperText })
        : undefined,
    activeLabel: f.activeLabelKey
      ? t(f.activeLabelKey)
      : f.activeLabel
        ? t(`boolean.${f.name}On`, { defaultValue: f.activeLabel })
        : undefined,
    inactiveLabel: f.inactiveLabelKey
      ? t(f.inactiveLabelKey)
      : f.inactiveLabel
        ? t(`boolean.${f.name}Off`, { defaultValue: f.inactiveLabel })
        : undefined,
  }));
}

/** Pickup / delivery status options for selects */
export function translateStatuses(list, t, ns = "statuses") {
  return list.map((s) => ({
    ...s,
    label: s.labelKey
      ? t(s.labelKey)
      : t(`${ns}.${s.value}`, { defaultValue: s.label ?? s.value }),
  }));
}
