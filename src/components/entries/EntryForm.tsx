import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEntriesStore } from "../../stores/entriesStore";
import { useCategoriesStore } from "../../stores/categoriesStore";
import CategoryForm from "../categories/CategoryForm";

type EntryFormProps = {
  embedded?: boolean;
  onSuccess?: () => void;
};

export default function EntryForm({ embedded = false, onSuccess }: EntryFormProps) {
  const categories = useCategoriesStore((state) => state.categories);

  const description = useEntriesStore((state) => state.description);
  const value = useEntriesStore((state) => state.value);
  const date = useEntriesStore((state) => state.date);
  const category = useEntriesStore((state) => state.category);
  const isCreating = useEntriesStore((state) => state.isCreating);
  const createMessage = useEntriesStore((state) => state.createMessage);

  const setDescription = useEntriesStore((state) => state.setDescription);
  const setValue = useEntriesStore((state) => state.setValue);
  const setDate = useEntriesStore((state) => state.setDate);
  const setCategory = useEntriesStore((state) => state.setCategory);
  const clearCreateMessage = useEntriesStore((state) => state.clearCreateMessage);
  const createEntry = useEntriesStore((state) => state.createEntry);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]._id);
    }
  }, [categories, category, setCategory]);

  useEffect(() => {
    if (!createMessage.includes("sucesso")) return;

    const timeoutId = window.setTimeout(() => {
      clearCreateMessage();
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [createMessage, clearCreateMessage]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createEntry();

    const message = useEntriesStore.getState().createMessage;
    if (message.includes("sucesso")) {
      onSuccess?.();
    }
  }

  function handleCategoryChange(newValue: string) {
    if (newValue === "__add_category__") {
      setIsCategoryModalOpen(true);
      return;
    }
    setCategory(newValue);
  }

  function handleCategoryCreated(categoryId: string) {
    setCategory(categoryId);
    setIsCategoryModalOpen(false);
  }

  const content = (
    <>
      {!embedded ? (
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Nova transação
        </Typography>
      ) : null}

      <Grid
        container
        component="form"
        spacing={1.2}
        onSubmit={handleSubmit}
        sx={{
          paddingTop: 1,
          maxWidth: embedded ? "100%" : 460,
        }}
      >
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Descrição"
            placeholder="Lanche, cinema com os amigos, salario, etc"
            fullWidth
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Valor"
            type="number"
            fullWidth
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Data"
            type="date"
            fullWidth
            value={date}
            onChange={(event) => setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            select
            label="Categoria"
            fullWidth
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
          >
            <MenuItem value="__add_category__">+ Adicionar categoria</MenuItem>
            {categories.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Stack direction="row" justifyContent="center" sx={{ mt: 1.5 }}>
            <Button type="submit" variant="contained" disabled={isCreating} sx={{ minWidth: { sm: 170 } }} fullWidth>
              {isCreating ? "Salvando..." : "Nova transação"}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {createMessage ? (
        <Alert severity={createMessage.includes("sucesso") ? "success" : "error"} sx={{ mt: 1.5 }}>
          {createMessage}
        </Alert>
      ) : null}

      <Dialog
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "min(92vw, 500px)",
          },
        }}
      >
        <DialogTitle>Adicionar categoria</DialogTitle>
        <DialogContent>
          <CategoryForm embedded onCreated={handleCategoryCreated} />
        </DialogContent>
      </Dialog>
    </>
  );

  if (embedded) {
    return <Box>{content}</Box>;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, md: 2 },
        mb: 2,
        borderRadius: 3,
      }}
    >
      {content}
    </Paper>
  );
}
