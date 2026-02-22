import type { ReactNode } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PoupaMais
          </Typography>

          <Typography sx={{ mr: 2 }}>{user?.name ?? "Usuário"}</Typography>

          <IconButton color="inherit" onClick={toggleMode}>
            {mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>

          <Button color="inherit" onClick={clearAuth}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>{children}</Container>
    </Box>
  );
}
