import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";

type Props = {
  title: string;
  color: string;
  expense: boolean;
  isCreating: boolean;
  createMessage: string;
  onChangeTitle: (value: string) => void;
  onChangeColor: (value: string) => void;
  onChangeExpense: (value: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function CategoryForm({
  title,
  color,
  expense,
  isCreating,
  createMessage,
  onChangeTitle,
  onChangeColor,
  onChangeExpense,
  onSubmit,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Nova categoria
      </Typography>

      <Box component="form" onSubmit={onSubmit}>
        <TextField
          label="Titulo"
          fullWidth
          margin="normal"
          value={title}
          onChange={(event) => onChangeTitle(event.target.value)}
        />

        <TextField
          label="Cor"
          type="color"
          fullWidth
          margin="normal"
          value={color}
          onChange={(event) => onChangeColor(event.target.value)}
        />

        <TextField
          select
          label="Tipo"
          fullWidth
          margin="normal"
          value={expense ? "expense" : "income"}
          onChange={(event) => onChangeExpense(event.target.value === "expense")}
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
