import { useEffect, useState } from "react";
import type { CategoryPayload } from "../services/categoriesApi";
import { useCategoriesStore } from "../stores/categoriesStore";
import type { Category } from "../types/category";

export function useCategories() {
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const errorMessage = useCategoriesStore((state) => state.errorMessage);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const addCategory = useCategoriesStore((state) => state.addCategory);
  const editCategory = useCategoriesStore((state) => state.editCategory);
  const removeCategory = useCategoriesStore((state) => state.removeCategory);

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#1976d2");
  const [expense, setExpense] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateMessage("");

    if (!title.trim()) {
      setCreateMessage("Informe o titulo da categoria.");
      return;
    }

    setIsCreating(true);

    const payload: CategoryPayload = {
      title: title.trim(),
      color,
      expense,
    };

    const result = await addCategory(payload);

    if (result.ok) {
      setTitle("");
      setColor("#1976d2");
      setExpense(true);
    }

    setCreateMessage(result.message);
    setIsCreating(false);
  }

  function openEdit(category: Category) {
    setEditMessage("");
    setEditingCategory(category);
  }

  function closeEdit() {
    if (isSavingEdit) return;
    setEditingCategory(null);
    setEditMessage("");
  }

  async function saveEdit(payload: CategoryPayload) {
    if (!editingCategory) return;

    setIsSavingEdit(true);
    const result = await editCategory(editingCategory._id, payload);
    setIsSavingEdit(false);

    if (result.ok) {
      setEditingCategory(null);
      setEditMessage("");
      return;
    }

    setEditMessage(result.message);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await removeCategory(id);
    setDeletingId(null);

    if (!result.ok) {
      setCreateMessage(result.message);
    }
  }

  return {
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
  };
}
