import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

/** Analog clock UI for hours/minutes (24h when ampm={false}). */
export const analogClockViewRenderers = {
  hours: renderTimeViewClock,
  minutes: renderTimeViewClock,
  seconds: renderTimeViewClock,
};
