import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import type { Category } from "../../types/category";

type Props = {
  open: boolean;
  category: Category | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: { title: string; color: string; expense: boolean }) => Promise<void>;
};

export default function CategoryEditDialog({
  open,
  category,
  isSaving,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#1976d2");
  const [expense, setExpense] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!category) return;
    setTitle(category.title);
    setColor(category.color);
    setExpense(category.expense);
    setMessage("");
  }, [category]);

  async function handleSave() {
    setMessage("");

    if (!title.trim()) {
      setMessage("Informe o titulo da categoria.");
      return;
    }

    await onSave({
      title: title.trim(),
      color,
      expense,
    });
  }

  return (
    <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar categoria</DialogTitle>

      <DialogContent>
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

        {message ? <Alert severity="error">{message}</Alert> : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
