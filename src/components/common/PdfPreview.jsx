import { useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { resolveMediaUrl } from "@/utils/mediaUrl";

export default function PdfPreview({
  url,
  title,
  height = 220,
  showOpenButton = true,
  openLabel = "View PDF",
}) {
  const src = resolveMediaUrl(url);
  const [failed, setFailed] = useState(false);

  if (!src) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          borderRadius: 1,
        }}
      >
        <PictureAsPdfOutlinedIcon sx={{ fontSize: 48, opacity: 0.35 }} />
      </Box>
    );
  }

  if (failed) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          bgcolor: "action.hover",
          borderRadius: 1,
          px: 2,
        }}
      >
        <PictureAsPdfOutlinedIcon sx={{ fontSize: 40, opacity: 0.45 }} />
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Preview unavailable in browser
        </Typography>
        {showOpenButton ? (
          <Button
            component="a"
            href={src}
            target="_blank"
            rel="noreferrer"
            size="small"
            variant="outlined"
            startIcon={<OpenInNewOutlinedIcon />}
          >
            {openLabel}
          </Button>
        ) : null}
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        component="object"
        data={src}
        type="application/pdf"
        title={title || "PDF"}
        onError={() => setFailed(true)}
        sx={{
          display: "block",
          width: "100%",
          height,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            PDF preview not supported
          </Typography>
          <Button
            component="a"
            href={src}
            target="_blank"
            rel="noreferrer"
            size="small"
            variant="outlined"
            startIcon={<OpenInNewOutlinedIcon />}
          >
            {openLabel}
          </Button>
        </Box>
      </Box>
      {showOpenButton ? (
        <Tooltip title={openLabel}>
          <IconButton
            component="a"
            href={src}
            target="_blank"
            rel="noreferrer"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <OpenInNewOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  );
}
