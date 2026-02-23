import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  MenuRounded,
  PieChartOutline,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import { useCategoriesStore } from "../../stores/categoriesStore";
import { useEntriesStore } from "../../stores/entriesStore";
import { Link as RouterLink, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const entries = useEntriesStore((state) => state.entries);
  const fetchEntries = useEntriesStore((state) => state.fetchEntries);
  const [isNavOpen, setIsNavOpen] = useState(false);

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

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    [],
  );

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
        <Toolbar sx={{ gap: { xs: 1, md: 2 }, minHeight: { xs: 64, md: 72 }, px: { xs: 1, sm: 2 } }}>
          <IconButton
            color="inherit"
            onClick={() => setIsNavOpen(true)}
            aria-label="Abrir menu"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuRounded />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1.2} sx={{ flexGrow: 1 }}>
            <InsightsOutlined />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 18, md: 20 } }}>
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
                maxWidth: { xs: 110, md: "none" },
                textDecoration: "none",
                cursor: "pointer",
                display: { xs: "none", sm: "inline-flex" },
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

      <Drawer
        anchor="left"
        open={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        PaperProps={{ sx: { width: 280, maxWidth: "88vw" } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Poupa+
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email ?? "Navegacao"}
          </Typography>
        </Box>

        <Divider />

        <List sx={{ py: 1 }}>
          <ListItemButton
            component={RouterLink}
            to="/dashboard"
            selected={location.pathname === "/dashboard"}
            onClick={() => setIsNavOpen(false)}
          >
            <ListItemIcon>
              <PieChartOutline />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={RouterLink}
            to="/transacoes"
            selected={location.pathname === "/transacoes"}
            onClick={() => setIsNavOpen(false)}
          >
            <ListItemIcon>
              <ReceiptLongOutlined />
            </ListItemIcon>
            <ListItemText primary="Transacoes" />
          </ListItemButton>

          <ListItemButton
            component={RouterLink}
            to="/categorias"
            selected={location.pathname === "/categorias"}
            onClick={() => setIsNavOpen(false)}
          >
            <ListItemIcon>
              <CategoryOutlined />
            </ListItemIcon>
            <ListItemText primary="Categorias" />
          </ListItemButton>

          <ListItemButton
            component={RouterLink}
            to="/profile"
            selected={location.pathname === "/profile"}
            onClick={() => setIsNavOpen(false)}
          >
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItemButton>
        </List>
      </Drawer>

      <Paper
        square
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 0.9, px: { xs: 1.5, sm: 3 } }}>
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
              label={`Saldo Total: ${currencyFormatter.format(totalBalance)}`}
              color={totalBalance >= 0 ? "success" : "error"}
              sx={{ fontWeight: 600, maxWidth: "100%" }}
            />
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3.5 }, px: { xs: 1.5, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}
