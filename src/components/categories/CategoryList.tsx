import { Alert, Button, List, ListItem, ListItemText, Paper, Stack } from "@mui/material";
import type { Category } from "../../types/category";

type Props = {
  categories: Category[];
  isLoading: boolean;
  errorMessage: string;
  deletingId: string | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
};

export default function CategoryList({
  categories,
  isLoading,
  errorMessage,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) return null;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
  if (categories.length === 0) return <Alert severity="info">Nenhuma categoria cadastrada.</Alert>;

  return (
    <Paper variant="outlined">
      <List>
        {categories.map((category) => (
          <ListItem key={category._id} divider>
            <ListItemText
              primary={category.title}
              secondary={`${category.expense ? "Despesa" : "Receita"} | Cor: ${category.color}`}
            />

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => onEdit(category)}>
                Editar
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(category._id)}
                disabled={deletingId === category._id}
              >
                {deletingId === category._id ? "Excluindo..." : "Excluir"}
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
