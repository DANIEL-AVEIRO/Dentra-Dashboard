import { Typography } from "@mui/material";

/** Monospace resource identifier (pickup ID, delivery ID, etc.) */
export default function ResourceId({ children, variant = "body2", component = "span", ...rest }) {
  return (
    <Typography
      component={component}
      variant={variant}
      className="resource-id"
      fontWeight={700}
      {...rest}
    >
      {children}
    </Typography>
  );
}
