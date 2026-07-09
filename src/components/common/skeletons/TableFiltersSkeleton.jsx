import { Box } from "@mui/material";
import { tablePanelToolbarSx } from "@/constants/tablePanel";
import Skel from "@/components/common/skeletons/Skel";

export default function TableFiltersSkeleton({ fields = 4 }) {
  return (
    <Box sx={tablePanelToolbarSx}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.25,
        }}
      >
        <Skel variant="rounded" height={40} sx={{ minWidth: 200, flex: "1 1 220px", maxWidth: 280 }} />
        <Skel variant="rounded" height={40} sx={{ width: 158 }} />
        <Skel variant="rounded" height={40} sx={{ width: 158 }} />
        {fields > 3 &&
          Array.from({ length: fields - 3 }).map((_, i) => (
            <Skel key={i} variant="rounded" height={40} sx={{ width: 176 }} />
          ))}
        <Skel variant="rounded" height={40} width={40} />
        <Skel variant="rounded" height={40} width={40} />
      </Box>
    </Box>
  );
}
