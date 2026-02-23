import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
} from "@mui/material";
import { useEntriesStore } from "../../stores/entriesStore";
import { useCategoriesStore } from "../../stores/categoriesStore";

function normalizeId(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";

  const obj = value as {
    _id?: unknown;
    id?: unknown;
    $oid?: unknown;
    toHexString?: () => string;
    toString?: () => string;
  };

  if (typeof obj.$oid === "string") return obj.$oid.trim();

  if (typeof obj.toHexString === "function") {
    return obj.toHexString().trim();
  }

  if (obj._id !== undefined) return normalizeId(obj._id);
  if (obj.id !== undefined) return normalizeId(obj.id);

  if (typeof obj.toString === "function" && obj.toString !== Object.prototype.toString) {
    const converted = obj.toString().trim();
    return converted === "[object Object]" ? "" : converted;
  }

  return "";
}

export default function EntryList() {
  const categories = useCategoriesStore((state) => state.categories);

  const entries = useEntriesStore((state) => state.entries);
  const isLoading = useEntriesStore((state) => state.isLoading);
  const errorMessage = useEntriesStore((state) => state.errorMessage);
  const deleteMessage = useEntriesStore((state) => state.deleteMessage);
  const deletingId = useEntriesStore((state) => state.deletingId);
  const openEdit = useEntriesStore((state) => state.openEdit);
  const deleteEntry = useEntriesStore((state) => state.deleteEntry);

  const search = useEntriesStore((state) => state.search);
  const categoryFilter = useEntriesStore((state) => state.categoryFilter);
  const startDate = useEntriesStore((state) => state.startDate);
  const endDate = useEntriesStore((state) => state.endDate);

  const filteredEntries = entries.filter((entry) => {
    const term = search.trim().toLowerCase();

    const matchesText =
      !term ||
      entry.title.toLowerCase().includes(term) ||
      (entry.details ?? "").toLowerCase().includes(term);

    const matchesCategory =
      !categoryFilter || normalizeId(entry.category) === normalizeId(categoryFilter);

    const entryDate = new Date(entry.date);
    const startOk = !startDate || entryDate >= new Date(`${startDate}T00:00:00`);
    const endOk = !endDate || entryDate <= new Date(`${endDate}T23:59:59`);

    return matchesText && matchesCategory && startOk && endOk;
  });

  if (isLoading) return null;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
  if (filteredEntries.length === 0) return <Alert severity="info">Nenhum lançamento cadastrado.</Alert>;

  function getCategoryTitle(categoryRef: string | { _id: string; title?: string }) {
    if (typeof categoryRef !== "string") {
      return categoryRef.title ?? "Categoria";
    }

    const found = categories.find((item) => item._id === categoryRef);
    return found?.title ?? "Categoria";
  }

  return (
    <>
      {deleteMessage ? <Alert severity="error" sx={{ mb: 1 }}>{deleteMessage}</Alert> : null}
      <Paper variant="outlined">
        <List>
          {filteredEntries.map((entry) => (
            <ListItem key={entry._id} divider>
              <ListItemText
                primary={`${entry.title} - R$ ${entry.value.toFixed(2)}`}
                secondary={`${getCategoryTitle(entry.category)} | ${new Date(entry.date).toLocaleDateString("pt-BR")}`}
              />

              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => openEdit(entry)}>
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteEntry(entry._id)}
                  disabled={deletingId === entry._id}
                >
                  {deletingId === entry._id ? "Excluindo..." : "Excluir"}
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}
