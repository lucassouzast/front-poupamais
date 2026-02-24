import {
  Alert,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useEntriesStore } from "../../stores/entriesStore";
import { useCategoriesStore } from "../../stores/categoriesStore";
import type { Category } from "../../types/category";

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

  if (typeof obj.toString === "function" && obj.toString !== Object.prototype.toString) {
    const converted = obj.toString().trim();
    return converted === "[object Object]" ? "" : converted;
  }

  return "";
}

function getCategoryByEntry(
  categoryRef: string | { _id: string; title?: string },
  categories: Category[],
): Category | null {
  if (typeof categoryRef !== "string") {
    const categoryId = normalizeId(categoryRef._id);
    return categories.find((item) => normalizeId(item._id) === categoryId) ?? null;
  }

  const categoryId = normalizeId(categoryRef);
  return categories.find((item) => normalizeId(item._id) === categoryId) ?? null;
}

export default function EntryList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const categories = useCategoriesStore((state) => state.categories);

  const entries = useEntriesStore((state) => state.entries);
  const isLoading = useEntriesStore((state) => state.isLoading);
  const errorMessage = useEntriesStore((state) => state.errorMessage);
  const deleteMessage = useEntriesStore((state) => state.deleteMessage);
  const deletingId = useEntriesStore((state) => state.deletingId);
  const openEdit = useEntriesStore((state) => state.openEdit);
  const deleteEntry = useEntriesStore((state) => state.deleteEntry);

  const search = useEntriesStore((state) => state.search);
  const categoryFilter = useEntriesStore((state) => state.categoryFilter);
  const startDate = useEntriesStore((state) => state.startDate);
  const endDate = useEntriesStore((state) => state.endDate);

  const filteredEntries = entries.filter((entry) => {
    const term = search.trim().toLowerCase();

    const matchesText =
      !term ||
      (entry.description ?? "").toLowerCase().includes(term);

    const matchesCategory =
      !categoryFilter || normalizeId(entry.category) === normalizeId(categoryFilter);

    const entryDate = new Date(entry.date);
    const startOk = !startDate || entryDate >= new Date(`${startDate}T00:00:00`);
    const endOk = !endDate || entryDate <= new Date(`${endDate}T23:59:59`);

    return matchesText && matchesCategory && startOk && endOk;
  });

  if (isLoading) return null;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;

  if (filteredEntries.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
        <Alert severity="info">Nenhuma transação encontrada para os filtros atuais.</Alert>
      </Paper>
    );
  }

  return (
    <>
      {deleteMessage ? <Alert severity="error" sx={{ mb: 1 }}>{deleteMessage}</Alert> : null}

      {isMobile ? (
        <Stack spacing={1}>
          {filteredEntries.map((entry) => {
            const currentCategory = getCategoryByEntry(entry.category, categories);
            const isExpense = currentCategory?.expense ?? false;
            const amountColor = isExpense ? "error.main" : "success.main";
            const signal = isExpense ? "-" : "+";

            return (
              <Paper key={entry._id} variant="outlined" sx={{ p: 1.2, borderRadius: 1 }}>
                <Stack spacing={0.8}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={700}>{entry.description || "Sem descricao"}</Typography>
                    <Typography sx={{ color: amountColor, fontWeight: 700 }}>
                      {`${signal} R$ ${entry.value.toFixed(2)}`}
                    </Typography>
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </Typography>

                  <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={currentCategory?.title ?? "Categoria"}
                      size="small"
                      sx={{
                        bgcolor: currentCategory?.color ?? "#d8e4ff",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={isExpense ? "Despesa" : "Receita"}
                      size="small"
                      color={isExpense ? "error" : "success"}
                      variant="filled"
                    />
                  </Stack>

                  <Stack direction="row" spacing={0.8} justifyContent="flex-end">
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => openEdit(entry)}>
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        onClick={() => deleteEntry(entry._id)}
                        disabled={deletingId === entry._id}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Descricao</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell align="center">Acoes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((entry) => {
                const currentCategory = getCategoryByEntry(entry.category, categories);
                const isExpense = currentCategory?.expense ?? false;
                const amountColor = isExpense ? "error.main" : "success.main";
                const signal = isExpense ? "-" : "+";

                return (
                  <TableRow key={entry._id} hover>
                    <TableCell>{new Date(entry.date).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Stack spacing={0.2}>
                        <Typography fontWeight={600}>{entry.description || "Sem descricao"}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={currentCategory?.title ?? "Categoria"}
                        size="small"
                        sx={{
                          bgcolor: currentCategory?.color ?? "#d8e4ff",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isExpense ? "Despesa" : "Receita"}
                        size="small"
                        color={isExpense ? "error" : "success"}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ color: amountColor, fontWeight: 700 }}>
                      {`${signal} R$ ${entry.value.toFixed(2)}`}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.8} justifyContent="center">
                        <Tooltip title="Editar">
                          <IconButton color="primary" onClick={() => openEdit(entry)}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Excluir">
                          <IconButton
                            color="error"
                            onClick={() => deleteEntry(entry._id)}
                            disabled={deletingId === entry._id}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
