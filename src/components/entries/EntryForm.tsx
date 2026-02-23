import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useEntriesContext } from "../../contexts/EntriesContext";

export default function EntryForm() {
  const {
    categories,
    title,
    value,
    date,
    details,
    category,
    isCreating,
    createMessage,
    setTitle,
    setValue,
    setDate,
    setDetails,
    setCategory,
    handleCreateEntry,
  } = useEntriesContext();

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Novo lançamento
      </Typography>

      <Box component="form" onSubmit={handleCreateEntry}>
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
