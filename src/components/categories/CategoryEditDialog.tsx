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
import { useCategoriesStore } from "../../stores/categoriesStore";

export default function CategoryEditDialog() {
  const editingCategory = useCategoriesStore((state) => state.editingCategory);
  const isSavingEdit = useCategoriesStore((state) => state.isSavingEdit);
  const editMessage = useCategoriesStore((state) => state.editMessage);
  const closeEdit = useCategoriesStore((state) => state.closeEdit);
  const saveEdit = useCategoriesStore((state) => state.saveEdit);

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#1976d2");
  const [expense, setExpense] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!editingCategory) return;
    setTitle(editingCategory.title);
    setColor(editingCategory.color);
    setExpense(editingCategory.expense);
    setMessage("");
  }, [editingCategory]);

  async function handleSave() {
    setMessage("");

    if (!title.trim()) {
      setMessage("Informe o titulo da categoria.");
      return;
    }

    await saveEdit({
      title: title.trim(),
      color,
      expense,
    });
  }

  return (
    <Dialog
      open={Boolean(editingCategory)}
      onClose={isSavingEdit ? undefined : closeEdit}
      fullWidth
      maxWidth="sm"
    >
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
        {editMessage ? <Alert severity="error" sx={{ mt: 1 }}>{editMessage}</Alert> : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={closeEdit} disabled={isSavingEdit}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSavingEdit}>
          {isSavingEdit ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
