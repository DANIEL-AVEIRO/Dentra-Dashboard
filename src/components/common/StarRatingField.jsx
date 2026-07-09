import { Box, Rating, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { parseRatingValue } from "@/utils/ratingValue";

/** Interactive star rating (1–max). */
export default function StarRatingField({
  value,
  onChange,
  max = 5,
  disabled = false,
  size = "large",
}) {
  const num = parseRatingValue(value, max);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <Rating
        value={num}
        max={max}
        disabled={disabled}
        size={size}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" />}
        onChange={(_, next) => onChange(next ?? 0)}
      />
      {num != null ? (
        <Typography variant="body2" color="text.secondary" aria-hidden>
          {num}/{max}
        </Typography>
      ) : null}
    </Box>
  );
}
