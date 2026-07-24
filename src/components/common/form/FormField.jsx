import { Box, FormHelperText, Typography } from "@mui/material";

/**
 * Top-aligned label + control + helper — clearer than floating MUI labels in dense dialogs.
 */
export default function FormField({
  id,
  label,
  required = false,
  error,
  helperText,
  description,
  controlFullWidth = true,
  children,
}) {
  const fieldId = id ? `field-${id}` : undefined;
  const hint = error || helperText;

  return (
    <Box
      component="fieldset"
      sx={{
        border: 0,
        m: 0,
        p: 0,
        minWidth: 0,
        width: "100%",
        // Kill theme/control vertical margins so label stays glued to its input
        "& .MuiFormControl-root, & .MuiTextField-root, & .MuiAutocomplete-root": {
          marginTop: 0,
          marginBottom: 0,
        },
      }}
    >
      {label ? (
        <Typography
          component="label"
          htmlFor={fieldId}
          variant="body2"
          sx={{
            display: "block",
            fontWeight: 700,
            fontSize: "0.8125rem",
            letterSpacing: "0.02em",
            color: "text.primary",
            mb: description ? 0.25 : 0.5,
            lineHeight: 1.35,
            wordBreak: "break-word",
          }}
        >
          {label}
          {required ? (
            <Box component="span" sx={{ color: "error.main", ml: 0.25 }} aria-hidden>
              *
            </Box>
          ) : null}
        </Typography>
      ) : null}
      {description ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5, lineHeight: 1.4 }}
        >
          {description}
        </Typography>
      ) : null}
      <Box
        sx={{
          width: controlFullWidth ? "100%" : "fit-content",
          maxWidth: "100%",
          "& .MuiFormHelperText-root": { display: "none" },
        }}
      >
        {fieldId && children
          ? // Clone to wire id when child is a single element
            typeof children === "object" && children != null
            ? children
            : children
          : children}
      </Box>
      {hint ? (
        <FormHelperText error={Boolean(error)} sx={{ mx: 0, mt: 0.5, lineHeight: 1.4 }}>
          {hint}
        </FormHelperText>
      ) : null}
    </Box>
  );
}
