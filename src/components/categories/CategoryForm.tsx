import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useCategoriesContext } from "../../contexts/CategoriesContext";

export default function CategoryForm() {
  const {
    title,
    color,
    expense,
    isCreating,
    createMessage,
    setTitle,
    setColor,
    setExpense,
    handleCreateCategory,
  } = useCategoriesContext();

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Nova categoria
      </Typography>

      <Box component="form" onSubmit={handleCreateCategory}>
        <TextField
          label="Titulo"
          fullWidth
          margin="normal"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <TextField
          label="Cor"
          type="color"
          fullWidth
          margin="normal"
          value={color}
          onChange={(event) => setColor(event.target.value)}
        />

        <TextField
          select
          label="Tipo"
          fullWidth
          margin="normal"
          value={expense ? "expense" : "income"}
          onChange={(event) => setExpense(event.target.value === "expense")}
        >
          <MenuItem value="expense">Despesa</MenuItem>
          <MenuItem value="income">Receita</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" disabled={isCreating} sx={{ mt: 1 }}>
          {isCreating ? "Salvando..." : "Criar categoria"}
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
