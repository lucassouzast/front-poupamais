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
import { useEntriesStore } from "../../stores/entriesStore";
import { useCategoriesStore } from "../../stores/categoriesStore";

export default function EntryEditDialog() {
  const categories = useCategoriesStore((state) => state.categories);
  const editingEntry = useEntriesStore((state) => state.editingEntry);
  const isSavingEdit = useEntriesStore((state) => state.isSavingEdit);
  const editMessage = useEntriesStore((state) => state.editMessage);
  const closeEdit = useEntriesStore((state) => state.closeEdit);
  const saveEdit = useEntriesStore((state) => state.saveEdit);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    if (!editingEntry) return;
    setTitle(editingEntry.title);
    setValue(String(editingEntry.value));
    setDate(editingEntry.date ? editingEntry.date.slice(0, 10) : "");
    setDetails(editingEntry.details ?? "");
    setCategory(typeof editingEntry.category === "string" ? editingEntry.category : editingEntry.category._id);
    setLocalMessage("");
  }, [editingEntry]);

  async function handleSave() {
    setLocalMessage("");

    if (!title.trim()) {
      setLocalMessage("Informe o titulo.");
      return;
    }

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

    await saveEdit({
      title: title.trim(),
      value: numericValue,
      date,
      details: details.trim(),
      category,
    });
  }

  return (
    <Dialog
      open={Boolean(editingEntry)}
      onClose={isSavingEdit ? undefined : closeEdit}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Editar lançamento</DialogTitle>

      <DialogContent>
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

        {localMessage ? <Alert severity="error">{localMessage}</Alert> : null}
        {editMessage ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {editMessage}
          </Alert>
        ) : null}
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
