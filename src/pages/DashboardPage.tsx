import { CircularProgress, Typography } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import CategoryEditDialog from "../components/categories/CategoryEditDialog";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import EntryEditDialog from "../components/entries/EntryEditDialog";
import EntryFilters from "../components/entries/EntryFilters";
import EntryForm from "../components/entries/EntryForm";
import EntryList from "../components/entries/EntryList";
import { CategoriesProvider } from "../contexts/CategoriesContext";
import { EntriesProvider, useEntriesContext } from "../contexts/EntriesContext";
import { useCategoriesContext } from "../contexts/CategoriesContext";

function CategoriesSection() {
  const { isLoading } = useCategoriesContext();

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
  const { isLoading: isEntriesLoading } = useEntriesContext();

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
  return (
    <AppLayout>
      <Typography variant="h4" mb={2}>
        Dashboard
      </Typography>

      <CategoriesProvider>
        <EntriesProvider>
          <CategoriesSection />

          <Typography variant="h6" mt={4} mb={1}>
            Lançamento
          </Typography>

          <EntriesSection />
        </EntriesProvider>
      </CategoriesProvider>
    </AppLayout>
  );
}
