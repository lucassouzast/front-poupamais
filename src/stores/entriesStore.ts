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

type EntriesState = {
  entries: Entry[];
  isLoading: boolean;
  errorMessage: string;
  deleteMessage: string;

  title: string;
  value: string;
  date: string;
  details: string;
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

  setTitle: (value: string) => void;
  setValue: (value: string) => void;
  setDate: (value: string) => void;
  setDetails: (value: string) => void;
  setCategory: (value: string) => void;

  setCategoryFilter: (value: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setSearch: (value: string) => void;

  createEntry: () => Promise<void>;

  openEdit: (entry: Entry) => void;
  closeEdit: () => void;
  saveEdit: (payload: EntryPayload) => Promise<void>;

  deleteEntry: (id: string) => Promise<void>;
  resetState: () => void;
};

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  isLoading: false,
  errorMessage: "",
  deleteMessage: "",

  title: "",
  value: "",
  date: "",
  details: "",
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

  setTitle: (value) => set({ title: value }),
  setValue: (value) => set({ value }),
  setDate: (value) => set({ date: value }),
  setDetails: (value) => set({ details: value }),
  setCategory: (value) => set({ category: value }),

  setCategoryFilter: (value) => set({ categoryFilter: value }),
  setStartDate: (value) => set({ startDate: value }),
  setEndDate: (value) => set({ endDate: value }),
  setSearch: (value) => set({ search: value }),

  createEntry: async () => {
    const { title, value, date, details, category } = get();
    set({ createMessage: "", deleteMessage: "" });

    if (!title.trim()) {
      set({ createMessage: "Informe o titulo." });
      return;
    }

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
      title: title.trim(),
      value: numericValue,
      date,
      details: details.trim(),
      category,
    };

    try {
      const created = await createEntryService(payload);
      set((state) => ({
        entries: [created, ...state.entries],
        title: "",
        value: "",
        date: "",
        details: "",
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
      title: "",
      value: "",
      date: "",
      details: "",
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
