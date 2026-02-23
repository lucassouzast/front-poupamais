import { useCallback, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AutorenewRounded,
  CategoryOutlined,
  ExpandMoreRounded,
  SouthWestRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import AppLayout from "../components/layout/AppLayout";
import PageLoadingOverlay from "../components/layout/PageLoadingOverlay";
import CategoryEditDialog from "../components/categories/CategoryEditDialog";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import { useCategoriesStore } from "../stores/categoriesStore";

function SummaryMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.35,
        borderRadius: 1,
        boxShadow: "0 4px 14px rgba(2, 6, 23, 0.05)",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Box>
        {icon}
      </Stack>
    </Paper>
  );
}

export default function CategoriesPage() {
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const categories = useCategoriesStore((state) => state.categories);

  const handleRefresh = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const expenseCount = categories.filter((item) => item.expense).length;
  const incomeCount = categories.length - expenseCount;
  const expenseRatio = categories.length > 0 ? (expenseCount / categories.length) * 100 : 0;
  const incomeRatio = 100 - expenseRatio;

  return (
    <AppLayout>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.2}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 1.6 }}
      >
        <Stack spacing={0.2}>
          <Typography variant="h4">Categorias</Typography>
          <Typography color="text.secondary">Estruture receitas e despesas para um controle mais limpo.</Typography>
        </Stack>

        <Button startIcon={<AutorenewRounded />} variant="outlined" onClick={handleRefresh}>
          Atualizar
        </Button>
      </Stack>

      <Grid container spacing={1.6}>
        <Grid size={{ xs: 12, lg: 8.6 }}>
          <Grid container spacing={1.2} sx={{ mb: 1.2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <SummaryMetric label="Total" value={String(categories.length)} icon={<CategoryOutlined color="primary" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <SummaryMetric label="Receitas" value={String(incomeCount)} icon={<TrendingUpRounded color="success" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <SummaryMetric label="Despesas" value={String(expenseCount)} icon={<SouthWestRounded color="error" />} />
            </Grid>
          </Grid>

          <CategoryList />
        </Grid>

        <Grid size={{ xs: 12, lg: 3.4 }}>
          <Stack spacing={1.2}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.35,
                borderRadius: 1,
                boxShadow: "0 4px 14px rgba(2, 6, 23, 0.05)",
              }}
            >
              <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Distribuição
                  </Typography>
                  <Chip size="small" label={`${Math.round(incomeRatio)}% / ${Math.round(expenseRatio)}%`} />
                </Stack>
                <Box sx={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", bgcolor: "divider" }}>
                  <Box sx={{ width: `${incomeRatio}%`, bgcolor: "success.main" }} />
                  <Box sx={{ width: `${expenseRatio}%`, bgcolor: "error.main" }} />
                </Box>
              </Stack>
            </Paper>

            <CategoryForm />

            <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Typography variant="subtitle2" color="text.secondary">
                  Boas praticas
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.7}>
                  <Typography variant="body2" color="text.secondary">
                    Use categorias curtas e objetivas para facilitar filtros e relatorios.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Evite duplicar categorias com nomes parecidos.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revise mensalmente e arquive categorias sem uso.
                  </Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>

      <CategoryEditDialog />
      <PageLoadingOverlay open={isLoading} />
    </AppLayout>
  );
}
