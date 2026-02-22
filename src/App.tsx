import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useThemeStore } from "./stores/themeStore";
import { getAppTheme } from "./theme/theme";
import AppRouter from "./routes/AppRouter";

export default function App() {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}
