import { Skeleton } from "@mui/material";

/** Consistent wave skeleton across the dashboard */
export default function Skel(props) {
  return <Skeleton animation="wave" {...props} />;
}
