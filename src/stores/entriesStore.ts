import { create } from "zustand";
import {
  createEntryService,
  deleteEntryService,
  listEntriesService,
  updateEntryService,
  type EntryPayload,
  type UpdateEntryPayload,
} from "../services/entriesApi";
import type { Entry } from "../types/entry";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function getTodayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

type EntriesState = {
  entries: Entry[];
  isLoading: boolean;
  errorMessage: string;
  deleteMessage: string;

  description: string;
  value: string;
  date: string;
  category: string;

  categoryFilter: string;
  startDate: string;
  endDate: string;
  search: string;

  isCreating: boolean;
  createMessage: string;

  editingEntry: Entry | null;
  isSavingEdit: boolean;
  editMessage: string;

  deletingId: string | null;

  fetchEntries: () => Promise<void>;

  setDescription: (value: string) => void;
  setValue: (value: string) => void;
  setDate: (value: string) => void;
  setCategory: (value: string) => void;

  setCategoryFilter: (value: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setSearch: (value: string) => void;
  clearCreateMessage: () => void;

  createEntry: () => Promise<void>;

  openEdit: (entry: Entry) => void;
  closeEdit: () => void;
  saveEdit: (payload: UpdateEntryPayload) => Promise<void>;

  deleteEntry: (id: string) => Promise<void>;
  resetState: () => void;
};

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  isLoading: false,
  errorMessage: "",
  deleteMessage: "",

  description: "",
  value: "",
  date: getTodayISODate(),
  category: "",

  categoryFilter: "",
  startDate: "",
  endDate: "",
  search: "",

  isCreating: false,
  createMessage: "",

  editingEntry: null,
  isSavingEdit: false,
  editMessage: "",

  deletingId: null,

  fetchEntries: async () => {
    set({ isLoading: true, errorMessage: "", deleteMessage: "" });
    try {
      const data = await listEntriesService();
      set({ entries: data });
    } catch {
      set({ errorMessage: "Nao foi possivel carregar lancamento." });
    } finally {
      set({ isLoading: false });
    }
  },

  setDescription: (value) => set({ description: value }),
  setValue: (value) => set({ value }),
  setDate: (value) => set({ date: value }),
  setCategory: (value) => set({ category: value }),

  setCategoryFilter: (value) => set({ categoryFilter: value }),
  setStartDate: (value) => set({ startDate: value }),
  setEndDate: (value) => set({ endDate: value }),
  setSearch: (value) => set({ search: value }),
  clearCreateMessage: () => set({ createMessage: "" }),

  createEntry: async () => {
    const { description, value, date, category } = get();
    set({ createMessage: "", deleteMessage: "" });

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      set({ createMessage: "Informe um valor valido maior que zero." });
      return;
    }

    if (!date) {
      set({ createMessage: "Informe a data." });
      return;
    }

    if (!category) {
      set({ createMessage: "Selecione uma categoria." });
      return;
    }

    set({ isCreating: true });

    const payload: EntryPayload = {
      description: description.trim() || undefined,
      value: numericValue,
      date,
      category,
    };

    try {
      const created = await createEntryService(payload);
      set((state) => ({
        entries: [created, ...state.entries],
        description: "",
        value: "",
        date: getTodayISODate(),
        createMessage: "Lancamento criado com sucesso.",
      }));
    } catch (error) {
      set({ createMessage: getApiErrorMessage(error, "Erro ao criar lancamento.") });
    } finally {
      set({ isCreating: false });
    }
  },

  openEdit: (entry) => {
    set({ editingEntry: entry, editMessage: "", deleteMessage: "" });
  },

  closeEdit: () => {
    if (get().isSavingEdit) return;
    set({ editingEntry: null, editMessage: "" });
  },

  saveEdit: async (payload) => {
    const editingEntry = get().editingEntry;
    if (!editingEntry) return;

    set({ isSavingEdit: true });

    try {
      const updated = await updateEntryService(editingEntry._id, payload);
      set((state) => ({
        entries: state.entries.map((item) =>
          item._id === editingEntry._id ? updated : item,
        ),
        editingEntry: null,
        editMessage: "",
      }));
    } catch (error) {
      set({ editMessage: getApiErrorMessage(error, "Erro ao atualizar lancamento.") });
    } finally {
      set({ isSavingEdit: false });
    }
  },

  deleteEntry: async (id) => {
    set({ deletingId: id, deleteMessage: "" });
    try {
      await deleteEntryService(id);
      set((state) => ({
        entries: state.entries.filter((item) => item._id !== id),
        deleteMessage: "",
      }));
    } catch (error) {
      set({ deleteMessage: getApiErrorMessage(error, "Erro ao excluir lancamento.") });
    } finally {
      set({ deletingId: null });
    }
  },

  resetState: () => {
    set({
      entries: [],
      isLoading: false,
      errorMessage: "",
      deleteMessage: "",
      description: "",
      value: "",
      date: getTodayISODate(),
      category: "",
      categoryFilter: "",
      startDate: "",
      endDate: "",
      search: "",
      isCreating: false,
      createMessage: "",
      editingEntry: null,
      isSavingEdit: false,
      editMessage: "",
      deletingId: null,
    });
  },
}));
