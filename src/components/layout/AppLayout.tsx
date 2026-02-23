import { useEffect, useMemo, type ReactNode } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  CategoryOutlined,
  DarkMode,
  InsightsOutlined,
  LightMode,
  Logout,
  PieChartOutline,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import { useCategoriesStore } from "../../stores/categoriesStore";
import { useEntriesStore } from "../../stores/entriesStore";
import { Link as RouterLink } from "react-router-dom";

type Props = {
  children: ReactNode;
};

function normalizeId(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";

  const obj = value as { _id?: unknown; id?: unknown };
  if (obj._id !== undefined) return normalizeId(obj._id);
  if (obj.id !== undefined) return normalizeId(obj.id);
  return "";
}

export default function AppLayout({ children }: Props) {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const entries = useEntriesStore((state) => state.entries);
  const fetchEntries = useEntriesStore((state) => state.fetchEntries);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    if (entries.length === 0) {
      fetchEntries();
    }
  }, [categories.length, entries.length, fetchCategories, fetchEntries]);

  const totalBalance = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const entry of entries) {
      const categoryId = normalizeId(entry.category);
      const category = categories.find((item) => normalizeId(item._id) === categoryId);

      if (category?.expense) {
        expense += entry.value;
      } else {
        income += entry.value;
      }
    }

    return income - expense;
  }, [entries, categories]);

  const lastUpdatedLabel = useMemo(() => {
    const timestamps = [
      ...entries.map((entry) => entry.updatedAt ?? entry.createdAt ?? entry.date).filter(Boolean),
      ...categories.map((category) => category.updatedAt ?? category.createdAt).filter(Boolean),
    ]
      .map((value) => new Date(value as string).getTime())
      .filter((value) => Number.isFinite(value));

    if (timestamps.length === 0) return "--/--/---- --:--";

    const latest = new Date(Math.max(...timestamps));
    return latest.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [entries, categories]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #16A34A 0%, #22C55E 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.18)",
          color: "#F1F5F9",
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: 72 }}>
          <Stack direction="row" alignItems="center" spacing={1.2} sx={{ flexGrow: 1 }}>
            <InsightsOutlined />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Poupa+
            </Typography>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: "rgba(255,255,255,0.24)",
                mx: 1,
                display: { xs: "none", md: "block" },
              }}
            />

            <Button
              color="inherit"
              component={RouterLink}
              to="/dashboard"
              startIcon={<PieChartOutline />}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Dashboard
            </Button>

            <Button
              color="inherit"
              startIcon={<ReceiptLongOutlined />}
              component={RouterLink}
              to="/transacoes"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Transações
            </Button>

            <Button
              color="inherit"
              startIcon={<CategoryOutlined />}
              component={RouterLink}
              to="/categorias"
              sx={{ display: { xs: "none", lg: "inline-flex" } }}
            >
              Categorias
            </Button>
          </Stack>

          <Tooltip title={user?.email ?? "Ir para perfil"}>
            <Chip
              component={RouterLink}
              to="/profile"
              clickable
              icon={<AccountCircle />}
              label={user?.name ?? "Usuario"}
              sx={{
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.16)",
                "& .MuiChip-icon": { color: "#fff" },
                maxWidth: { xs: 120, md: "none" },
                textDecoration: "none",
                cursor: "pointer",
              }}
            />
          </Tooltip>

          <IconButton color="inherit" onClick={toggleMode} aria-label="Alternar tema">
            {mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>

          <IconButton color="inherit" onClick={clearAuth} aria-label="Sair">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper
        square
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 0.9 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              Ultima atualização: {lastUpdatedLabel}
            </Typography>
            <Chip
              label={`Saldo Total: R$ ${totalBalance.toFixed(2)}`}
              color={totalBalance >= 0 ? "success" : "error"}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3.5 } }}>
        {children}
      </Container>
    </Box>
  );
}
