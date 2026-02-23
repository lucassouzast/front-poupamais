import { Alert, Button, List, ListItem, ListItemText, Paper, Stack } from "@mui/material";
import { useCategoriesStore } from "../../stores/categoriesStore";

export default function CategoryList() {
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const errorMessage = useCategoriesStore((state) => state.errorMessage);
  const deleteMessage = useCategoriesStore((state) => state.deleteMessage);
  const deletingId = useCategoriesStore((state) => state.deletingId);
  const openEdit = useCategoriesStore((state) => state.openEdit);
  const deleteCategory = useCategoriesStore((state) => state.deleteCategory);

  if (isLoading) return null;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
  if (categories.length === 0) return <Alert severity="info">Nenhuma categoria cadastrada.</Alert>;

  return (
    <>
      {deleteMessage ? <Alert severity="error" sx={{ mb: 1 }}>{deleteMessage}</Alert> : null}
      <Paper variant="outlined">
        <List>
          {categories.map((category) => (
            <ListItem key={category._id} divider>
              <ListItemText
                primary={category.title}
                secondary={`${category.expense ? "Despesa" : "Receita"} | Cor: ${category.color}`}
              />

              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => openEdit(category)}>
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteCategory(category._id)}
                  disabled={deletingId === category._id}
                >
                  {deletingId === category._id ? "Excluindo..." : "Excluir"}
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}
