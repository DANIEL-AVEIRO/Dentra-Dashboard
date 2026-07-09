import { Box } from "@mui/material";
import { useTableHighlight } from "@/context/TableHighlightContext";
import { splitBySearchQuery } from "@/utils/highlightSearch";

/**
 * YouTube-style inline highlight for table search matches.
 * Reads active query from TableHighlightContext when `query` is omitted.
 */
export default function HighlightText({ text, query: queryProp, component = "span" }) {
  const contextQuery = useTableHighlight();
  const query = queryProp ?? contextQuery;
  const display = text == null || text === "" ? "—" : String(text);
  const segments = splitBySearchQuery(display, query);
  const hasMatch = segments.some((s) => s.match);

  if (!query?.trim() || !hasMatch) {
    return <Box component={component}>{display}</Box>;
  }

  return (
    <Box component={component} sx={{ wordBreak: "break-word" }}>
      {segments.map((seg, i) =>
        seg.match ? (
          <Box
            key={i}
            component="mark"
            className="arrow-search-highlight"
            sx={{ color: "inherit" }}
          >
            {seg.text}
          </Box>
        ) : (
          <Box key={i} component="span">
            {seg.text}
          </Box>
        )
      )}
    </Box>
  );
}
