import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ToastContainer } from "react-toastify";
import { useThemeMode } from "@/context/ThemeContext";
import "react-toastify/dist/ReactToastify.css";

/**
 * react-toastify — colors from global.css (html[data-theme]), not RT built-in theme.
 * Mobile: top-center below fixed app bar + safe area (global.css --toastify-toast-top).
 */
export default function AppToaster() {
  const { mode } = useThemeMode();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <ToastContainer
      position={isMobile ? "top-center" : "top-right"}
      autoClose={4200}
      newestOnTop
      limit={4}
      closeButton
      hideProgressBar
      pauseOnHover
      draggable
      pauseOnFocusLoss={false}
      className={`arrow-toast-container arrow-toast-container--${mode}`}
      toastClassName="arrow-toast"
      style={{
        zIndex: (muiTheme?.zIndex?.snackbar ?? 1400) + 2,
      }}
    />
  );
}
