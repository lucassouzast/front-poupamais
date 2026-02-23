import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
} from "@mui/material";
import { useEntriesContext } from "../../contexts/EntriesContext";

export default function EntryList() {
  const {
    filteredEntries,
    categories,
    isLoading,
    errorMessage,
    deletingId,
    openEdit,
    handleDelete,
  } = useEntriesContext();

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
                onClick={() => handleDelete(entry._id)}
                disabled={deletingId === entry._id}
              >
                {deletingId === entry._id ? "Excluindo..." : "Excluir"}
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
