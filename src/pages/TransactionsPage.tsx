import { useCallback, useEffect } from "react";
import { Button, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { AutorenewRounded } from "@mui/icons-material";
import AppLayout from "../components/layout/AppLayout";
import PageLoadingOverlay from "../components/layout/PageLoadingOverlay";
import EntryEditDialog from "../components/entries/EntryEditDialog";
import EntryFilters from "../components/entries/EntryFilters";
import EntryList from "../components/entries/EntryList";
import { useCategoriesStore } from "../stores/categoriesStore";
import { useEntriesStore } from "../stores/entriesStore";

export default function TransactionsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const categoriesLoading = useCategoriesStore((state) => state.isLoading);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const entriesLoading = useEntriesStore((state) => state.isLoading);
  const fetchEntries = useEntriesStore((state) => state.fetchEntries);

  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchCategories(), fetchEntries()]);
  }, [fetchCategories, fetchEntries]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <AppLayout>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack spacing={0.4}>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.8rem", sm: "2.125rem" } }}>
            Transações
          </Typography>
          <Typography color="text.secondary">Filtre e gerencie seus lançamentos.</Typography>
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

      <EntryFilters />
      <EntryList />
      <EntryEditDialog />

      <PageLoadingOverlay open={categoriesLoading || entriesLoading} />
    </AppLayout>
  );
}
