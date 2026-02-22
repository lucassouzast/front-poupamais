import { useEffect, useState } from "react";
import type { EntryPayload } from "../services/entriesApi";
import { useEntriesStore } from "../stores/entriesStore";
import { useCategoriesStore } from "../stores/categoriesStore";
import type { Entry } from "../types/entry";

export function useEntries() {
  const entries = useEntriesStore((state) => state.entries);
  const isLoading = useEntriesStore((state) => state.isLoading);
  const errorMessage = useEntriesStore((state) => state.errorMessage);
  const fetchEntries = useEntriesStore((state) => state.fetchEntries);
  const addEntry = useEntriesStore((state) => state.addEntry);
  const editEntry = useEntriesStore((state) => state.editEntry);
  const removeEntry = useEntriesStore((state) => state.removeEntry);

  const categories = useCategoriesStore((state) => state.categories);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]._id);
    }
  }, [categories, category]);

  async function handleCreateEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateMessage("");

    if (!title.trim()) {
      setCreateMessage("Informe o titulo.");
      return;
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setCreateMessage("Informe um valor valido maior que zero.");
      return;
    }

    if (!date) {
      setCreateMessage("Informe a data.");
      return;
    }

    if (!category) {
      setCreateMessage("Selecione uma categoria.");
      return;
    }

    setIsCreating(true);

    const payload: EntryPayload = {
      title: title.trim(),
      value: numericValue,
      date,
      details: details.trim(),
      category,
    };

    const result = await addEntry(payload);

    if (result.ok) {
      setTitle("");
      setValue("");
      setDate("");
      setDetails("");
    }

    setCreateMessage(result.message);
    setIsCreating(false);
  }

  function openEdit(entry: Entry) {
    setEditMessage("");
    setEditingEntry(entry);
  }

  function closeEdit() {
    if (isSavingEdit) return;
    setEditingEntry(null);
    setEditMessage("");
  }

  async function saveEdit(payload: EntryPayload) {
    if (!editingEntry) return;

    setIsSavingEdit(true);
    const result = await editEntry(editingEntry._id, payload);
    setIsSavingEdit(false);

    if (result.ok) {
      setEditingEntry(null);
      setEditMessage("");
      return;
    }

    setEditMessage(result.message);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await removeEntry(id);
    setDeletingId(null);

    if (!result.ok) {
      setCreateMessage(result.message);
    }
  }

  const filteredEntries = entries.filter((entry) => {
  const term = search.trim().toLowerCase();
  if (!term) return true;

  return (
    entry.title.toLowerCase().includes(term) ||
    (entry.details ?? "").toLowerCase().includes(term)
  );
});


  return {
    entries,
    isLoading,
    errorMessage,
    categories,
    search,
    filteredEntries,
    title,
    value,
    date,
    details,
    category,
    setSearch,
    setTitle,
    setValue,
    setDate,
    setDetails,
    setCategory,

    isCreating,
    createMessage,
    handleCreateEntry,

    editingEntry,
    isSavingEdit,
    editMessage,
    openEdit,
    closeEdit,
    saveEdit,

    deletingId,
    handleDelete,
  };
}
