import { useEffect } from "react";
import { Alert, Box, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useCategoriesStore } from "../../stores/categoriesStore";

type CategoryFormProps = {
  embedded?: boolean;
  onCreated?: (categoryId: string) => void;
};

export default function CategoryForm({ embedded = false, onCreated }: CategoryFormProps) {
  const title = useCategoriesStore((state) => state.title);
  const color = useCategoriesStore((state) => state.color);
  const expense = useCategoriesStore((state) => state.expense);
  const isCreating = useCategoriesStore((state) => state.isCreating);
  const createMessage = useCategoriesStore((state) => state.createMessage);
  const setTitle = useCategoriesStore((state) => state.setTitle);
  const setColor = useCategoriesStore((state) => state.setColor);
  const setExpense = useCategoriesStore((state) => state.setExpense);
  const clearCreateMessage = useCategoriesStore((state) => state.clearCreateMessage);
  const createCategory = useCategoriesStore((state) => state.createCategory);

  useEffect(() => {
    if (!createMessage.includes("sucesso")) return;

    const timeoutId = window.setTimeout(() => {
      clearCreateMessage();
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [createMessage, clearCreateMessage]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createCategory();

    const state = useCategoriesStore.getState();
    if (state.createMessage.includes("sucesso") && state.categories.length > 0) {
      onCreated?.(state.categories[0]._id);
    }
  }

  const content = (
    <>
      {!embedded ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">Nova categoria</Typography>
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: color,
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        </Stack>
      ) : null}

      <Grid container component="form" spacing={1} onSubmit={handleSubmit}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Título"
            fullWidth
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Cor"
            type="color"
            fullWidth
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Tipo"
            fullWidth
            value={expense ? "expense" : "income"}
            onChange={(event) => setExpense(event.target.value === "expense")}
          >
            <MenuItem value="expense">Despesa</MenuItem>
            <MenuItem value="income">Receita</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" disabled={isCreating} fullWidth>
            {isCreating ? "Salvando..." : "Criar categoria"}
          </Button>
        </Grid>
      </Grid>

      {createMessage ? (
        <Alert severity={createMessage.includes("sucesso") ? "success" : "error"} sx={{ mt: 1.2 }}>
          {createMessage}
        </Alert>
      ) : null}
    </>
  );

  if (embedded) {
    return <Box>{content}</Box>;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.4,
        borderRadius: 1,
        boxShadow: "0 4px 14px rgba(2, 6, 23, 0.05)",
      }}
    >
      {content}
    </Paper>
  );
}
