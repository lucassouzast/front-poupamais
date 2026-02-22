import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import type { Category } from "../../types/category";

type Props = {
  categories: Category[];
  title: string;
  value: string;
  date: string;
  details: string;
  category: string;
  isCreating: boolean;
  createMessage: string;
  onChangeTitle: (value: string) => void;
  onChangeValue: (value: string) => void;
  onChangeDate: (value: string) => void;
  onChangeDetails: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function EntryForm({
  categories,
  title,
  value,
  date,
  details,
  category,
  isCreating,
  createMessage,
  onChangeTitle,
  onChangeValue,
  onChangeDate,
  onChangeDetails,
  onChangeCategory,
  onSubmit,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Novo lancamento
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
          label="Valor"
          type="number"
          fullWidth
          margin="normal"
          value={value}
          onChange={(event) => onChangeValue(event.target.value)}
        />

        <TextField
          label="Data"
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(event) => onChangeDate(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Detalhes"
          fullWidth
          margin="normal"
          value={details}
          onChange={(event) => onChangeDetails(event.target.value)}
        />

        <TextField
          select
          label="Categoria"
          fullWidth
          margin="normal"
          value={category}
          onChange={(event) => onChangeCategory(event.target.value)}
        >
          {categories.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.title}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" disabled={isCreating} sx={{ mt: 1 }}>
          {isCreating ? "Salvando..." : "Criar lancamento"}
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
