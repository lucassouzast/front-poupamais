import { Grid, MenuItem, TextField } from "@mui/material";
import { useEntriesContext } from "../../contexts/EntriesContext";

export default function EntryFilters() {
  const {
    categories,
    search,
    setSearch,
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
