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

  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

    if (
      typeof obj.toString === "function" &&
      obj.toString !== Object.prototype.toString
    ) {
      const converted = obj.toString().trim();
      return converted === "[object Object]" ? "" : converted;
    }

    return "";
  }

  const filteredEntries = entries.filter((entry) => {
    const term = search.trim().toLowerCase();

    const matchesText =
      !term ||
      entry.title.toLowerCase().includes(term) ||
      (entry.details ?? "").toLowerCase().includes(term);

    const matchesCategory =
      !categoryFilter ||
      normalizeId(entry.category) === normalizeId(categoryFilter);

    const entryDate = new Date(entry.date);
    const startOk =
      !startDate || entryDate >= new Date(`${startDate}T00:00:00`);
    const endOk = !endDate || entryDate <= new Date(`${endDate}T23:59:59`);

    return matchesText && matchesCategory && startOk && endOk;
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

    categoryFilter,
    setCategoryFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
}
