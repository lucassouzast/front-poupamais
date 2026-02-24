import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  AutorenewRounded,
  CalculateOutlined,
} from "@mui/icons-material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppLayout from "../components/layout/AppLayout";
import PageLoadingOverlay from "../components/layout/PageLoadingOverlay";
import FloatingFinanceButton from "../components/entries/FloatingFinanceButton";
import { useCategoriesStore } from "../stores/categoriesStore";
import { useEntriesStore } from "../stores/entriesStore";
import type { Entry } from "../types/entry";
import type { Category } from "../types/category";

function normalizeId(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";

  const obj = value as { _id?: unknown; id?: unknown };
  if (obj._id !== undefined) return normalizeId(obj._id);
  if (obj.id !== undefined) return normalizeId(obj.id);
  return "";
}

function getCategory(entry: Entry, categories: Category[]): Category | null {
  const categoryId = normalizeId(entry.category);
  return categories.find((item) => normalizeId(item._id) === categoryId) ?? null;
}

function StatCard({
  title,
  value,
  icon,
  background,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  background: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        color: "#fff",
        borderRadius: 1,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 0,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ opacity: 0.92, fontSize: { xs: 11, sm: 13 } }}>{title}</Typography>
        <Typography
          variant="h5"
          sx={{
            mt: 0.3,
            fontSize: { xs: 18, sm: 26 },
            whiteSpace: "nowrap",
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          ml: { xs: 0.6, sm: 1 },
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          "& .MuiSvgIcon-root": {
            fontSize: { xs: 28, sm: 36 },
          },
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const categories = useCategoriesStore((state) => state.categories);
  const categoriesLoading = useCategoriesStore((state) => state.isLoading);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const entries = useEntriesStore((state) => state.entries);
  const entriesLoading = useEntriesStore((state) => state.isLoading);
  const fetchEntries = useEntriesStore((state) => state.fetchEntries);

  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchCategories(), fetchEntries()]);
  }, [fetchCategories, fetchEntries]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const entry of entries) {
      const category = getCategory(entry, categories);
      if (category?.expense) {
        expense += entry.value;
      } else {
        income += entry.value;
      }
    }

    const total = income - expense;

    return {
      income,
      expense,
      total,
    };
  }, [entries, categories]);

  const monthlyData = useMemo(() => {
    const byMonth = new Map<
      string,
      { monthKey: string; monthLabel: string; receitas: number; despesas: number }
    >();

    for (const entry of entries) {
      const date = new Date(entry.date);
      if (Number.isNaN(date.getTime())) continue;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

      if (!byMonth.has(monthKey)) {
        byMonth.set(monthKey, {
          monthKey,
          monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
          receitas: 0,
          despesas: 0,
        });
      }

      const monthRef = byMonth.get(monthKey);
      if (!monthRef) continue;

      const category = getCategory(entry, categories);
      if (category?.expense) {
        monthRef.despesas += entry.value;
      } else {
        monthRef.receitas += entry.value;
      }
    }

    return [...byMonth.values()]
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .slice(-8);
  }, [entries, categories]);

  const recentTransactions = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .map((entry) => {
        const category = getCategory(entry, categories);
        const isExpense = category?.expense ?? false;

        return {
          id: entry._id,
          title: entry.description ?? "Sem descricao",
          date: new Date(entry.date).toLocaleDateString("pt-BR"),
          categoryTitle: category?.title ?? "Categoria",
          categoryColor: category?.color ?? "#334155",
          amount: entry.value,
          isExpense,
        };
      });
  }, [entries, categories]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    [],
  );

  return (
    <AppLayout>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack spacing={0.6}>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.8rem", sm: "2.125rem" } }}>
            Dashboard
          </Typography>
          <Typography color="text.secondary">Visão geral das suas finanças.</Typography>
        </Stack>

        <Button
          startIcon={<AutorenewRounded />}
          variant="outlined"
          onClick={handleRefresh}
          fullWidth={isMobile}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Atualizar
        </Button>
      </Stack>

      <Grid container spacing={1.4} sx={{ mb: 2.2 }}>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            title="Receitas"
            value={currencyFormatter.format(summary.income)}
            icon={<ArrowUpwardRounded fontSize="large" />}
            background="linear-gradient(140deg, #16A34A 0%, #22C55E 100%)"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            title="Despesas"
            value={currencyFormatter.format(summary.expense)}
            icon={<ArrowDownwardRounded fontSize="large" />}
            background="linear-gradient(140deg, #B91C1C 0%, #DC2626 100%)"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            title="Saldo do Mês"
            value={currencyFormatter.format(summary.total)}
            icon={<CalculateOutlined fontSize="large" />}
            background="linear-gradient(140deg, #0F766E 0%, #0EA5A3 100%)"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            title="Saldo Total"
            value={currencyFormatter.format(summary.total)}
            icon={<AccountBalanceWalletOutlined fontSize="large" />}
            background="linear-gradient(140deg, #1E293B 0%, #334155 100%)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ order: { xs: 2, lg: 1 } }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              height: { xs: 340, sm: 380, md: 420 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Fluxo de Caixa Mensal
            </Typography>

            <Box sx={{ width: "100%", height: { xs: 250, sm: 290, md: 340 } }}>
              <ResponsiveContainer>
                <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="4 4" stroke={theme.palette.divider} />
                  <XAxis dataKey="monthLabel" tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                  <YAxis
                    hide={isMobile}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    width={isMobile ? 0 : 38}
                  />
                  <Tooltip
                    formatter={(value: number | string | undefined) =>
                      currencyFormatter.format(typeof value === "number" ? value : Number(value ?? 0))
                    }
                    contentStyle={{
                      borderRadius: 10,
                      border: `1px solid ${theme.palette.divider}`,
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="receitas"
                    name="Receitas"
                    stroke="#22C55E"
                    fill="url(#incomeArea)"
                    strokeWidth={2.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    name="Despesas"
                    stroke="#DC2626"
                    fill="url(#expenseArea)"
                    strokeWidth={2.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }} sx={{ order: { xs: 1, lg: 2 } }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              height: { xs: 360, sm: 420 },
              overflow: "auto",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1.2 }}>
              Últimas Transações
            </Typography>

            <Stack divider={<Divider flexItem />}>
              {recentTransactions.map((item) => (
                <Stack key={item.id} spacing={0.5} sx={{ py: 1.1 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: item.isExpense ? "error.main" : "success.main",
                      }}
                    >
                      {item.isExpense ? "-" : "+"} {currencyFormatter.format(item.amount)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={0.8} flexWrap="wrap" useFlexGap>
                    <Typography variant="caption" color="text.secondary">
                      {item.date}
                    </Typography>
                    <Chip
                      label={item.categoryTitle}
                      size="small"
                      sx={{
                        bgcolor: item.categoryColor,
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                </Stack>
              ))}

              {recentTransactions.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 1 }}>
                  Nenhuma transacao recente.
                </Typography>
              ) : null}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <FloatingFinanceButton />
      <PageLoadingOverlay open={categoriesLoading || entriesLoading} />
    </AppLayout>
  );
}
