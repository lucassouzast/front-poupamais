import { useEffect } from "react";
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useEntriesStore } from "../../stores/entriesStore";
import { useCategoriesStore } from "../../stores/categoriesStore";

export default function EntryForm() {
  const categories = useCategoriesStore((state) => state.categories);

  const title = useEntriesStore((state) => state.title);
  const value = useEntriesStore((state) => state.value);
  const date = useEntriesStore((state) => state.date);
  const details = useEntriesStore((state) => state.details);
  const category = useEntriesStore((state) => state.category);
  const isCreating = useEntriesStore((state) => state.isCreating);
  const createMessage = useEntriesStore((state) => state.createMessage);

  const setTitle = useEntriesStore((state) => state.setTitle);
  const setValue = useEntriesStore((state) => state.setValue);
  const setDate = useEntriesStore((state) => state.setDate);
  const setDetails = useEntriesStore((state) => state.setDetails);
  const setCategory = useEntriesStore((state) => state.setCategory);
  const createEntry = useEntriesStore((state) => state.createEntry);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]._id);
    }
  }, [categories, category, setCategory]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createEntry();
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Novo lançamento
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Titulo"
          fullWidth
          margin="normal"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <TextField
          label="Valor"
          type="number"
          fullWidth
          margin="normal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />

        <TextField
          label="Data"
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Detalhes"
          fullWidth
          margin="normal"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />

        <TextField
          select
          label="Categoria"
          fullWidth
          margin="normal"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.title}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" disabled={isCreating} sx={{ mt: 1 }}>
          {isCreating ? "Salvando..." : "Criar lançamento"}
        </Button>
      </Box>

      {createMessage ? (
        <Alert severity={createMessage.includes("sucesso") ? "success" : "error"} sx={{ mt: 2 }}>
          {createMessage}
        </Alert>
      ) : null}
    </Paper>
  );
}
