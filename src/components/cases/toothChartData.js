/** FDI permanent dentition — position 1 = central incisor … 8 = third molar */

const TOOTH_TYPE_BY_POS = {
  1: "incisor",
  2: "incisor",
  3: "canine",
  4: "premolar",
  5: "premolar",
  6: "molar",
  7: "molar",
  8: "molar",
};

function quadrantTeeth(quadrant, order) {
  return order.map((pos) => {
    const fdi = `${quadrant}${pos}`;
    return {
      fdi,
      quadrant,
      position: pos,
      type: TOOTH_TYPE_BY_POS[pos],
    };
  });
}

/** Patient view: upper then lower, midline at center. */
export const UPPER_TEETH = [
  ...quadrantTeeth(1, [8, 7, 6, 5, 4, 3, 2, 1]),
  ...quadrantTeeth(2, [1, 2, 3, 4, 5, 6, 7, 8]),
];

export const LOWER_TEETH = [
  ...quadrantTeeth(4, [8, 7, 6, 5, 4, 3, 2, 1]),
  ...quadrantTeeth(3, [1, 2, 3, 4, 5, 6, 7, 8]),
];

export const ALL_TEETH = [...UPPER_TEETH, ...LOWER_TEETH];

export function parseToothSelection(value) {
  if (value == null || value === "") return new Set();
  const raw = String(value).trim();
  if (!raw) return new Set();

  const rangeMatch = /^(\d{2})-(\d{2})$/.exec(raw);
  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    const lo = Math.min(start, end);
    const hi = Math.max(start, end);
    const set = new Set();
    for (let n = lo; n <= hi; n += 1) {
      set.add(String(n));
    }
    return set;
  }

  return new Set(
    raw
      .split(/[,\s]+/)
      .map((part) => part.trim())
      .filter((part) => /^\d{2}$/.test(part)),
  );
}

export function formatToothSelection(selection) {
  const values = [...selection].map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (values.length === 0) return "";
  return values.map((n) => String(n)).join(",");
}

export function summarizeToothSelection(value) {
  const set = parseToothSelection(value);
  if (set.size === 0) return "";
  return formatToothSelection(set);
}
