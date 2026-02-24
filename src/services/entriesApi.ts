import { api } from "./api";
import type { Entry } from "../types/entry";

export type EntryPayload = {
  description?: string;
  value: number;
  date: string;
  category: string;
};

export type UpdateEntryPayload = {
  description?: string;
  value?: number;
  date?: string;
  category?: string;
};

export async function listEntriesService() {
  const response = await api.get<Entry[]>("/entries");
  return response.data;
}

export async function createEntryService(body: EntryPayload) {
  const response = await api.post<Entry>("/entries", body);
  return response.data;
}

export async function updateEntryService(id: string, body: UpdateEntryPayload) {
  const response = await api.put<Entry>(`/entries/${id}`, body);
  return response.data;
}

export async function deleteEntryService(id: string) {
  await api.delete(`/entries/${id}`);
}
