import { Grid, MenuItem, TextField } from "@mui/material";
import { useEntriesStore } from "../../stores/entriesStore";
import { useCategoriesStore } from "../../stores/categoriesStore";

export default function EntryFilters() {
  const categories = useCategoriesStore((state) => state.categories);

  const search = useEntriesStore((state) => state.search);
  const setSearch = useEntriesStore((state) => state.setSearch);
  const categoryFilter = useEntriesStore((state) => state.categoryFilter);
  const setCategoryFilter = useEntriesStore((state) => state.setCategoryFilter);
  const startDate = useEntriesStore((state) => state.startDate);
  const setStartDate = useEntriesStore((state) => state.setStartDate);
  const endDate = useEntriesStore((state) => state.endDate);
  const setEndDate = useEntriesStore((state) => state.setEndDate);

  return (
    <>
      <TextField
        label="Buscar lançamento (titulo/detalhes)"
        fullWidth
        margin="normal"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
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
            {categories.map((item) => (
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
