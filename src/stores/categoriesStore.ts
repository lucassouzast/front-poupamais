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

type Result = { ok: boolean; message: string };

type CategoriesState = {
  categories: Category[];
  isLoading: boolean;
  errorMessage: string;
  fetchCategories: () => Promise<void>;
  addCategory: (payload: CategoryPayload) => Promise<Result>;
  editCategory: (id: string, payload: CategoryPayload) => Promise<Result>;
  removeCategory: (id: string) => Promise<Result>;
};

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  isLoading: false,
  errorMessage: "",

  fetchCategories: async () => {
    set({ isLoading: true, errorMessage: "" });
    try {
      const data = await listCategoriesService();
      set({ categories: data });
    } catch {
      set({ errorMessage: "Nao foi possivel carregar categorias." });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (payload) => {
    try {
      const created = await createCategoryService(payload);
      set((state) => ({ categories: [created, ...state.categories] }));
      return { ok: true, message: "Categoria criada com sucesso." };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error, "Erro ao criar categoria.") };
    }
  },

  editCategory: async (id, payload) => {
    try {
      const updated = await updateCategoryService(id, payload);
      set((state) => ({
        categories: state.categories.map((item) => (item._id === id ? updated : item)),
      }));
      return { ok: true, message: "Categoria atualizada com sucesso." };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error, "Erro ao atualizar categoria.") };
    }
  },

  removeCategory: async (id) => {
    try {
      await deleteCategoryService(id);
      set((state) => ({
        categories: state.categories.filter((item) => item._id !== id),
      }));
      return { ok: true, message: "Categoria removida com sucesso." };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error, "Erro ao excluir categoria.") };
    }
  },
}));
