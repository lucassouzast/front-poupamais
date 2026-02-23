import { createTheme } from "@mui/material/styles";

export const getAppTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#22C55E",
      },
      secondary: {
        main: "#16A34A",
      },
      background: {
        default: mode === "light" ? "#F8FAFC" : "#0B0F14",
        paper: mode === "light" ? "#FFFFFF" : "#1A1F2B",
      },
      success: {
        main: "#22C55E",
      },
      error: {
        main: "#d14452",
      },
      text: {
        primary: mode === "light" ? "#0F172A" : "#F1F5F9",
        secondary: mode === "light" ? "#475569" : "#94A3B8",
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: "\"Sora\", \"Segoe UI\", sans-serif",
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1A1F2B",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: 600,
          },
          containedPrimary: {
            backgroundColor: "#16A34A",
            "&:hover": {
              backgroundColor: "#22C55E",
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#111827",
          },
        },
      },
    },
  });
