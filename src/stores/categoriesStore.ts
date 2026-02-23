import { create } from "zustand";
import {
  createCategoryService,
  deleteCategoryService,
  listCategoriesService,
  updateCategoryService,
  type CategoryPayload,
} from "../services/categoriesApi";
import type { Category } from "../types/category";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

type CategoriesState = {
  categories: Category[];
  isLoading: boolean;
  errorMessage: string;
  deleteMessage: string;

  title: string;
  color: string;
  expense: boolean;
  isCreating: boolean;
  createMessage: string;

  editingCategory: Category | null;
  isSavingEdit: boolean;
  editMessage: string;

  deletingId: string | null;

  fetchCategories: () => Promise<void>;

  setTitle: (value: string) => void;
  setColor: (value: string) => void;
  setExpense: (value: boolean) => void;
  createCategory: () => Promise<void>;

  openEdit: (category: Category) => void;
  closeEdit: () => void;
  saveEdit: (payload: CategoryPayload) => Promise<void>;

  deleteCategory: (id: string) => Promise<void>;
  resetState: () => void;
};

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  errorMessage: "",
  deleteMessage: "",

  title: "",
  color: "#1976d2",
  expense: true,
  isCreating: false,
  createMessage: "",

  editingCategory: null,
  isSavingEdit: false,
  editMessage: "",

  deletingId: null,

  fetchCategories: async () => {
    set({ isLoading: true, errorMessage: "", deleteMessage: "" });
    try {
      const data = await listCategoriesService();
      set({ categories: data });
    } catch {
      set({ errorMessage: "Nao foi possivel carregar categorias." });
    } finally {
      set({ isLoading: false });
    }
  },

  setTitle: (value) => set({ title: value }),
  setColor: (value) => set({ color: value }),
  setExpense: (value) => set({ expense: value }),

  createCategory: async () => {
    const { title, color, expense } = get();
    set({ createMessage: "", deleteMessage: "" });

    if (!title.trim()) {
      set({ createMessage: "Informe o titulo da categoria." });
      return;
    }

    set({ isCreating: true });

    const payload: CategoryPayload = {
      title: title.trim(),
      color,
      expense,
    };

    try {
      const created = await createCategoryService(payload);
      set((state) => ({
        categories: [created, ...state.categories],
        title: "",
        color: "#1976d2",
        expense: true,
        createMessage: "Categoria criada com sucesso.",
      }));
    } catch (error) {
      set({ createMessage: getApiErrorMessage(error, "Erro ao criar categoria.") });
    } finally {
      set({ isCreating: false });
    }
  },

  openEdit: (category) => {
    set({ editingCategory: category, editMessage: "", deleteMessage: "" });
  },

  closeEdit: () => {
    if (get().isSavingEdit) return;
    set({ editingCategory: null, editMessage: "" });
  },

  saveEdit: async (payload) => {
    const editingCategory = get().editingCategory;
    if (!editingCategory) return;

    set({ isSavingEdit: true });

    try {
      const updated = await updateCategoryService(editingCategory._id, payload);
      set((state) => ({
        categories: state.categories.map((item) =>
          item._id === editingCategory._id ? updated : item,
        ),
        editingCategory: null,
        editMessage: "",
      }));
    } catch (error) {
      set({ editMessage: getApiErrorMessage(error, "Erro ao atualizar categoria.") });
    } finally {
      set({ isSavingEdit: false });
    }
  },

  deleteCategory: async (id) => {
    set({ deletingId: id, deleteMessage: "" });
    try {
      await deleteCategoryService(id);
      set((state) => ({
        categories: state.categories.filter((item) => item._id !== id),
        deleteMessage: "",
      }));
    } catch (error) {
      set({ deleteMessage: getApiErrorMessage(error, "Erro ao excluir categoria.") });
    } finally {
      set({ deletingId: null });
    }
  },

  resetState: () => {
    set({
      categories: [],
      isLoading: false,
      errorMessage: "",
      deleteMessage: "",
      title: "",
      color: "#1976d2",
      expense: true,
      isCreating: false,
      createMessage: "",
      editingCategory: null,
      isSavingEdit: false,
      editMessage: "",
      deletingId: null,
    });
  },
}));
