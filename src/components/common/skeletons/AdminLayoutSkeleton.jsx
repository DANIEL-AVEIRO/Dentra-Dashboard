import { Box, Drawer, Paper } from "@mui/material";
import Skel from "@/components/common/skeletons/Skel";
import PageHeaderSkeleton from "@/components/common/skeletons/PageHeaderSkeleton";
import TableFiltersSkeleton from "@/components/common/skeletons/TableFiltersSkeleton";
import ResourceTableSkeleton from "@/components/common/skeletons/ResourceTableSkeleton";

import { DRAWER_WIDTH, APP_BAR_HEIGHT, PAGE_PADDING } from "@/constants/layout";

function SidebarSkeleton() {
  return (
    <Box sx={{ p: 1 }}>
      <Skel variant="text" width={90} height={28} />
      <Skel variant="text" width={100} height={14} sx={{ mt: 0.25 }} />
      <Box sx={{ mt: 1.5 }}>
        {Array.from({ length: 3 }).map((_, section) => (
          <Box key={section} sx={{ mb: 1 }}>
            <Skel variant="text" width={72} height={12} sx={{ mb: 0.5, ml: 0.5 }} />
            {Array.from({ length: section === 0 ? 3 : 2 }).map((__, i) => (
              <Skel
                key={i}
                variant="rounded"
                height={28}
                sx={{ mb: 0.25, mx: 0.5 }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function AdminLayoutSkeleton() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Paper
        elevation={0}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: APP_BAR_HEIGHT,
          borderRadius: 0,
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          px: 1,
          bgcolor: "primary.main",
        }}
      >
        <Skel
          variant="text"
          width={160}
          height={28}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <Box sx={{ flex: 1 }} />
        <Skel
          variant="circular"
          width={36}
          height={36}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <Skel
          variant="text"
          width={80}
          height={24}
          sx={{ ml: 1.5, bgcolor: "rgba(255,255,255,0.2)" }}
        />
      </Paper>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            mt: `${APP_BAR_HEIGHT}px`,
          },
        }}
        open
      >
        <SidebarSkeleton />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: PAGE_PADDING,
          mt: `${APP_BAR_HEIGHT}px`,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <PageHeaderSkeleton />
        <TableFiltersSkeleton />
        <ResourceTableSkeleton />
      </Box>
    </Box>
  );
}
