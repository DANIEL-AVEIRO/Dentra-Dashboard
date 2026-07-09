/**
 * Flatten and filter sidebar nav for menu search.
 */

export function flattenNavEntries(sections, t) {
  return sections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      sectionId: section.id,
      sectionTitle: t(section.titleKey),
      itemLabel: t(item.labelKey),
    }))
  );
}

export function searchNavEntries(sections, query, t) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return flattenNavEntries(sections, t).filter(
    (entry) =>
      entry.itemLabel.toLowerCase().includes(q) ||
      entry.sectionTitle.toLowerCase().includes(q)
  );
}
