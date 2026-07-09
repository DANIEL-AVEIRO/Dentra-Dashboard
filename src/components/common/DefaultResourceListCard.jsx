import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { rowLabelFromRow } from "@/utils/displayValue";

export default function DefaultResourceListCard({ row, columns, actions }) {
  const title = rowLabelFromRow(row, columns);
  const details = columns
    .filter((col) => col.key !== "id" && col.key !== columns[0]?.key)
    .slice(0, 3);

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={800} noWrap>
            {title || "—"}
          </Typography>
          {details.map((col) => (
            <Box key={col.key}>
              <Typography variant="caption" color="text.secondary" display="block">
                {col.label}
              </Typography>
              <Typography variant="body2" noWrap>
                {col.render ? col.render(row) : row[col.key] ?? "—"}
              </Typography>
            </Box>
          ))}
          {actions ? <Box sx={{ pt: 0.5 }}>{actions}</Box> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
