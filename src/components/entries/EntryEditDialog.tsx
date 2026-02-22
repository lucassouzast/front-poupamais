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
import type { Entry } from "../../types/entry";
import type { Category } from "../../types/category";

type SavePayload = {
  title: string;
  value: number;
  date: string;
  details: string;
  category: string;
};

type Props = {
  open: boolean;
  entry: Entry | null;
  categories: Category[];
  isSaving: boolean;
  message: string;
  onClose: () => void;
  onSave: (payload: SavePayload) => Promise<void>;
};

export default function EntryEditDialog({
  open,
  entry,
  categories,
  isSaving,
  message,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    if (!entry) return;
    setTitle(entry.title);
    setValue(String(entry.value));
    setDate(entry.date ? entry.date.slice(0, 10) : "");
    setDetails(entry.details ?? "");
    setCategory(entry.category);
    setLocalMessage("");
  }, [entry]);

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

    await onSave({
      title: title.trim(),
      value: numericValue,
      date,
      details: details.trim(),
      category,
    });
  }

  return (
    <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar lancamento</DialogTitle>

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
        {message ? <Alert severity="error" sx={{ mt: 1 }}>{message}</Alert> : null}
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
