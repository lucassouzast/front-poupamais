import { create } from "zustand";
import {
  createEntryService,
  deleteEntryService,
  listEntriesService,
  updateEntryService,
  type EntryPayload,
} from "../services/entriesApi";
import type { Entry } from "../types/entry";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

type Result = { ok: boolean; message: string };

type EntriesState = {
  entries: Entry[];
  isLoading: boolean;
  errorMessage: string;
  fetchEntries: () => Promise<void>;
  addEntry: (payload: EntryPayload) => Promise<Result>;
  editEntry: (id: string, payload: EntryPayload) => Promise<Result>;
  removeEntry: (id: string) => Promise<Result>;
};

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  isLoading: false,
  errorMessage: "",

  fetchEntries: async () => {
    set({ isLoading: true, errorMessage: "" });
    try {
      const data = await listEntriesService();
      set({ entries: data });
    } catch {
      set({ errorMessage: "Nao foi possivel carregar lancamentos." });
    } finally {
      set({ isLoading: false });
    }
  },

  addEntry: async (payload) => {
    try {
      const created = await createEntryService(payload);
      set((state) => ({ entries: [created, ...state.entries] }));
      return { ok: true, message: "Lancamento criado com sucesso." };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error, "Erro ao criar lancamento.") };
    }
  },

  editEntry: async (id, payload) => {
    try {
      const updated = await updateEntryService(id, payload);
      set((state) => ({
        entries: state.entries.map((item) => (item._id === id ? updated : item)),
      }));
      return { ok: true, message: "Lancamento atualizado com sucesso." };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error, "Erro ao atualizar lancamento.") };
    }
  },

  removeEntry: async (id) => {
    try {
      await deleteEntryService(id);
      set((state) => ({
        entries: state.entries.filter((item) => item._id !== id),
      }));
      return { ok: true, message: "Lancamento removido com sucesso." };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error, "Erro ao excluir lancamento.") };
    }
  },
}));
