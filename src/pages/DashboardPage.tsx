import {
  CircularProgress,
  TextField,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import CategoryEditDialog from "../components/categories/CategoryEditDialog";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import EntryEditDialog from "../components/entries/EntryEditDialog";
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

function EntriesFilters() {
  const {
    categories: entryCategories,
    search: entrySearch,
    setSearch: setEntrySearch,
    categoryFilter,
    setCategoryFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useEntriesContext();

  return (
    <>
      <TextField
        label="Buscar lançamento (titulo/detalhes)"
        fullWidth
        margin="normal"
        value={entrySearch}
        onChange={(event) => setEntrySearch(event.target.value)}
      />

      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            label="Categoria"
            fullWidth
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {entryCategories.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Data inicial"
            type="date"
            fullWidth
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Data final"
            type="date"
            fullWidth
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
    </>
  );
}

function EntriesSection() {
  const { isLoading: isEntriesLoading } = useEntriesContext();

  return (
    <>
      <EntryForm />
      <EntriesFilters />
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
