import { Box, Card, CardContent, Grid } from "@mui/material";
import Skel from "@/components/common/skeletons/Skel";

export default function FormCardSkeleton({ fields = 4, showAvatar = false }) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <CardContent>
        {showAvatar && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Skel variant="circular" width={72} height={72} />
            <Box sx={{ flex: 1 }}>
              <Skel variant="text" width={160} height={28} />
              <Skel variant="text" width={100} height={20} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        )}
        <Grid container spacing={1}>
          {Array.from({ length: fields }).map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skel variant="rounded" height={56} />
            </Grid>
          ))}
        </Grid>
        <Skel variant="rounded" width={140} height={36} sx={{ mt: 1.5 }} />
      </CardContent>
    </Card>
  );
}
