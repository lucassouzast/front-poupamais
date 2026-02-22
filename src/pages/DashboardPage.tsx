import {
  CircularProgress,
  TextField,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import CategoryEditDialog from "../components/categories/CategoryEditDialog";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import { useCategories } from "../hooks/useCategories";
import EntryEditDialog from "../components/entries/EntryEditDialog";

import EntryForm from "../components/entries/EntryForm";
import EntryList from "../components/entries/EntryList";
import { useEntries } from "../hooks/useEntries";

export default function DashboardPage() {
  const {
    categories,
    isLoading,
    errorMessage,

    title,
    color,
    expense,
    isCreating,
    createMessage,
    setTitle,
    setColor,
    setExpense,
    handleCreateCategory,

    editingCategory,
    isSavingEdit,
    editMessage,
    openEdit,
    closeEdit,
    saveEdit,

    deletingId,
    handleDelete,
  } = useCategories();

  const {
    isLoading: isEntriesLoading,
    errorMessage: entriesErrorMessage,
    categories: entryCategories,
    title: entryTitle,
    value: entryValue,
    date: entryDate,
    details: entryDetails,
    category: entryCategory,
    setTitle: setEntryTitle,
    setValue: setEntryValue,
    setDate: setEntryDate,
    setDetails: setEntryDetails,
    setCategory: setEntryCategory,
    isCreating: isCreatingEntry,
    createMessage: createEntryMessage,
    handleCreateEntry,
    search: entrySearch,
    setSearch: setEntrySearch,
    filteredEntries,

    editingEntry,
    isSavingEdit: isSavingEntryEdit,
    editMessage: entryEditMessage,
    openEdit: openEntryEdit,
    closeEdit: closeEntryEdit,
    saveEdit: saveEntryEdit,

    deletingId: deletingEntryId,
    handleDelete: handleDeleteEntry,

    categoryFilter,
    setCategoryFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useEntries();

  return (
    <AppLayout>
      <Typography variant="h4" mb={2}>
        Dashboard
      </Typography>

      <CategoryForm
        title={title}
        color={color}
        expense={expense}
        isCreating={isCreating}
        createMessage={createMessage}
        onChangeTitle={setTitle}
        onChangeColor={setColor}
        onChangeExpense={setExpense}
        onSubmit={handleCreateCategory}
      />

      <Typography variant="h6" mb={1}>
        Categorias
      </Typography>

      {isLoading ? <CircularProgress /> : null}

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        errorMessage={errorMessage}
        deletingId={deletingId}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <CategoryEditDialog
        open={Boolean(editingCategory)}
        category={editingCategory}
        isSaving={isSavingEdit}
        onClose={closeEdit}
        onSave={saveEdit}
      />

      <Typography variant="h6" mt={4} mb={1}>
        Lançamento
      </Typography>

      <EntryForm
        categories={entryCategories}
        title={entryTitle}
        value={entryValue}
        date={entryDate}
        details={entryDetails}
        category={entryCategory}
        isCreating={isCreatingEntry}
        createMessage={createEntryMessage}
        onChangeTitle={setEntryTitle}
        onChangeValue={setEntryValue}
        onChangeDate={setEntryDate}
        onChangeDetails={setEntryDetails}
        onChangeCategory={setEntryCategory}
        onSubmit={handleCreateEntry}
      />

      <TextField
        label="Buscar lançamento (titulo/detalhes)"
        fullWidth
        margin="normal"
        value={entrySearch}
        onChange={(event) => setEntrySearch(event.target.value)}
      />

      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            label="Categoria"
            fullWidth
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {entryCategories.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Data inicial"
            type="date"
            fullWidth
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Data final"
            type="date"
            fullWidth
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>

      {isEntriesLoading ? <CircularProgress /> : null}
      <EntryList
        entries={filteredEntries}
        categories={entryCategories}
        isLoading={isEntriesLoading}
        errorMessage={entriesErrorMessage}
        deletingId={deletingEntryId}
        onEdit={openEntryEdit}
        onDelete={handleDeleteEntry}
      />
      <EntryEditDialog
        open={Boolean(editingEntry)}
        entry={editingEntry}
        categories={entryCategories}
        isSaving={isSavingEntryEdit}
        message={entryEditMessage}
        onClose={closeEntryEdit}
        onSave={saveEntryEdit}
      />
    </AppLayout>
  );
}
