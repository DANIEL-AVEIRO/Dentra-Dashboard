import { Box, Paper } from "@mui/material";
import { pageToolbarPaperSx } from "@/constants/pageLayout";
import Skel from "@/components/common/skeletons/Skel";

export default function PageHeaderSkeleton({ showAction = true }) {
  return (
    <Paper elevation={0} sx={pageToolbarPaperSx}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.25, sm: 1.5 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Skel variant="rounded" width="min(220px, 55%)" height={22} />
          <Skel variant="rounded" width="min(360px, 85%)" height={16} />
        </Box>
        {showAction ? (
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <Skel variant="rounded" width="min(200px, 42%)" height={52} />
            <Skel variant="rounded" width={72} height={36} />
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}
