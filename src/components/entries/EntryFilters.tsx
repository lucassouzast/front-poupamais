import { Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
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
  const fetchEntries = useEntriesStore((state) => state.fetchEntries);

  function clearFilters() {
    setSearch("");
    setCategoryFilter("");
    setStartDate("");
    setEndDate("");
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, md: 2 },
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Filtros de transações
      </Typography>

      <Grid container spacing={1.2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Buscar por titulo ou detalhes"
            fullWidth
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
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

        <Grid size={{ xs: 6, md: 2.5 }}>
          <TextField
            label="De"
            type="date"
            fullWidth
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2.5 }}>
          <TextField
            label="Até"
            type="date"
            fullWidth
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 1.5 }}>
        <Button variant="contained" sx={{ minWidth: 160 }} onClick={() => fetchEntries()}>
          Filtrar
        </Button>
        <Button variant="outlined" color="inherit" onClick={clearFilters} sx={{ minWidth: 160 }}>
          Limpar
        </Button>
      </Stack>
    </Paper>
  );
}
