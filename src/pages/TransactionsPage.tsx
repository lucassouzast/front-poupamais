import { useCallback, useEffect } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { AutorenewRounded } from "@mui/icons-material";
import AppLayout from "../components/layout/AppLayout";
import PageLoadingOverlay from "../components/layout/PageLoadingOverlay";
import EntryEditDialog from "../components/entries/EntryEditDialog";
import EntryFilters from "../components/entries/EntryFilters";
import EntryList from "../components/entries/EntryList";
import { useCategoriesStore } from "../stores/categoriesStore";
import { useEntriesStore } from "../stores/entriesStore";

export default function TransactionsPage() {
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
          <Typography variant="h4">Transações</Typography>
          <Typography color="text.secondary">Filtre e gerencie seus lançamentos.</Typography>
        </Stack>

        <Button startIcon={<AutorenewRounded />} variant="outlined" onClick={handleRefresh}>
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
