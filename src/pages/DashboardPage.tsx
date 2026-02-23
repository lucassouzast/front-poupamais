import { useEffect } from "react";
import { CircularProgress, Typography } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import CategoryEditDialog from "../components/categories/CategoryEditDialog";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import EntryEditDialog from "../components/entries/EntryEditDialog";
import EntryFilters from "../components/entries/EntryFilters";
import EntryForm from "../components/entries/EntryForm";
import EntryList from "../components/entries/EntryList";
import { useCategoriesStore } from "../stores/categoriesStore";
import { useEntriesStore } from "../stores/entriesStore";

function CategoriesSection() {
  const isLoading = useCategoriesStore((state) => state.isLoading);

  return (
    <>
      <CategoryForm />
      <Typography variant="h6" mb={1}>
        Categorias
      </Typography>
      {isLoading ? <CircularProgress /> : null}
      <CategoryList />
      <CategoryEditDialog />
    </>
  );
}

function EntriesSection() {
  const isEntriesLoading = useEntriesStore((state) => state.isLoading);

  return (
    <>
      <EntryForm />
      <EntryFilters />
      {isEntriesLoading ? <CircularProgress /> : null}
      <EntryList />
      <EntryEditDialog />
    </>
  );
}

export default function DashboardPage() {
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const fetchEntries = useEntriesStore((state) => state.fetchEntries);

  useEffect(() => {
    fetchCategories();
    fetchEntries();
  }, [fetchCategories, fetchEntries]);

  return (
    <AppLayout>
      <Typography variant="h4" mb={2}>
        Dashboard
      </Typography>

      <CategoriesSection />

      <Typography variant="h6" mt={4} mb={1}>
        Lançamento
      </Typography>

      <EntriesSection />
    </AppLayout>
  );
}
