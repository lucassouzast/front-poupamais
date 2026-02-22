import { api } from "./api";
import type { Category } from "../types/category";

export type CategoryPayload = {
  title: string;
  color: string;
  expense: boolean;
};

export async function listCategoriesService() {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export async function createCategoryService(body: CategoryPayload) {
  const response = await api.post<Category>("/categories", body);
  return response.data;
}

export async function updateCategoryService(id: string, body: CategoryPayload) {
  const response = await api.put<Category>(`/categories/${id}`, body);
  return response.data;
}

export async function deleteCategoryService(id: string) {
  await api.delete(`/categories/${id}`);
}
