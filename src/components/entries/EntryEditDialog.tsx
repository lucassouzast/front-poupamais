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
import { useEntriesStore } from "../../stores/entriesStore";
import { useCategoriesStore } from "../../stores/categoriesStore";

export default function EntryEditDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const categories = useCategoriesStore((state) => state.categories);
  const editingEntry = useEntriesStore((state) => state.editingEntry);
  const isSavingEdit = useEntriesStore((state) => state.isSavingEdit);
  const editMessage = useEntriesStore((state) => state.editMessage);
  const closeEdit = useEntriesStore((state) => state.closeEdit);
  const saveEdit = useEntriesStore((state) => state.saveEdit);

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    if (!editingEntry) return;
    setDescription(editingEntry.description ?? "");
    setValue(String(editingEntry.value));
    setDate(editingEntry.date ? editingEntry.date.slice(0, 10) : "");
    setCategory(typeof editingEntry.category === "string" ? editingEntry.category : editingEntry.category._id);
    setLocalMessage("");
  }, [editingEntry]);

  async function handleSave() {
    setLocalMessage("");

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setLocalMessage("Informe um valor valido maior que zero.");
      return;
    }

    if (!date) {
      setLocalMessage("Informe a data.");
      return;
    }

    if (!category) {
      setLocalMessage("Selecione uma categoria.");
      return;
    }

    const selectedCategory = categories.find((item) => item._id === category);

    await saveEdit({
      description: description.trim() || selectedCategory?.title || undefined,
      value: numericValue,
      date,
      category,
    });
  }

  return (
    <Dialog
      open={Boolean(editingEntry)}
      onClose={isSavingEdit ? undefined : closeEdit}
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>Editar lançamento</DialogTitle>

      <DialogContent>
        <TextField
          label="Descrição"
          fullWidth
          margin="normal"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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

        {localMessage ? <Alert severity="error">{localMessage}</Alert> : null}
        {editMessage ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {editMessage}
          </Alert>
        ) : null}
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
