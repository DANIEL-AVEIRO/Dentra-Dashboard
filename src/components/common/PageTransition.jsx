import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { pageShellSx } from "@/constants/pageLayout";

/** Stable page shell with subtle route enter animation. */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <Box
      key={location.pathname}
      className="page-route page-route--enter"
      sx={{
        width: "100%",
        position: "relative",
        zIndex: 1,
        viewTransitionName: "page-content",
        ...pageShellSx,
      }}
    >
      {children}
    </Box>
  );
}
