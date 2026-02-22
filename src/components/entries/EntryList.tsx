import { Alert, Button, List, ListItem, ListItemText, Paper, Stack } from "@mui/material";
import type { Entry } from "../../types/entry";
import type { Category } from "../../types/category";

type Props = {
  entries: Entry[];
  categories: Category[];
  isLoading: boolean;
  errorMessage: string;
  deletingId: string | null;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
};

export default function EntryList({
  entries,
  categories,
  isLoading,
  errorMessage,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) return null;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
  if (entries.length === 0) return <Alert severity="info">Nenhum lancamento cadastrado.</Alert>;

  function getCategoryTitle(categoryId: string) {
    const found = categories.find((item) => item._id === categoryId);
    return found?.title ?? "Categoria";
  }

  return (
    <Paper variant="outlined">
      <List>
        {entries.map((entry) => (
          <ListItem key={entry._id} divider>
            <ListItemText
              primary={`${entry.title} - R$ ${entry.value.toFixed(2)}`}
              secondary={`${getCategoryTitle(entry.category)} | ${new Date(entry.date).toLocaleDateString("pt-BR")}`}
            />

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => onEdit(entry)}>
                Editar
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(entry._id)}
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
