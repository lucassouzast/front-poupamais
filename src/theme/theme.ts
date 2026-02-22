import { createTheme } from "@mui/material/styles";

export const getAppTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#0B6BCB",
      },
      secondary: {
        main: "#2E7D32",
      },
    },
  });
