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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCategoriesStore } from "../../stores/categoriesStore";

export default function CategoryEditDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
      fullScreen={fullScreen}
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

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 } }}>
        <Button onClick={closeEdit} disabled={isSavingEdit} fullWidth={fullScreen}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSavingEdit} fullWidth={fullScreen}>
          {isSavingEdit ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
