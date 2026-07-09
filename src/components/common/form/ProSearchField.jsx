import { InputAdornment, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProTextField from "@/components/common/form/ProTextField";
import { inputAdornmentSx } from "@/components/common/form/fieldStyles";

/**
 * Search field — MUI Autocomplete-style search bar for tables & filters.
 */
export default function ProSearchField({
  placeholder = "Search...",
  filterBar = false,
  sx,
  slotProps,
  ...props
}) {
  const theme = useTheme();

  return (
    <ProTextField
      filterBar={filterBar}
      placeholder={placeholder}
      sx={{
        minWidth: filterBar ? undefined : { xs: "100%", sm: 240 },
        maxWidth: filterBar ? undefined : 400,
        flex: filterBar ? undefined : { lg: 1 },
        ...sx,
      }}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          startAdornment: (
            <InputAdornment position="start" sx={inputAdornmentSx(theme, "start")}>
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}
