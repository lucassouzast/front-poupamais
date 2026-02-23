import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useCategoriesStore } from "../../stores/categoriesStore";
import { useEntriesStore } from "../../stores/entriesStore";

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "");
  const full = sanitized.length === 3
    ? sanitized.split("").map((ch) => ch + ch).join("")
    : sanitized;

  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return `rgba(148, 163, 184, ${alpha})`;

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeId(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";

  const obj = value as { _id?: unknown; id?: unknown; $oid?: unknown };
  if (typeof obj.$oid === "string") return obj.$oid.trim();
  if (obj._id !== undefined) return normalizeId(obj._id);
  if (obj.id !== undefined) return normalizeId(obj.id);
  return "";
}

export default function CategoryList() {
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const errorMessage = useCategoriesStore((state) => state.errorMessage);
  const deleteMessage = useCategoriesStore((state) => state.deleteMessage);
  const deletingId = useCategoriesStore((state) => state.deletingId);
  const openEdit = useCategoriesStore((state) => state.openEdit);
  const deleteCategory = useCategoriesStore((state) => state.deleteCategory);
  const entries = useEntriesStore((state) => state.entries);
  const [usageMessage, setUsageMessage] = useState("");

  const incomeCategories = useMemo(
    () => categories.filter((item) => !item.expense).sort((a, b) => a.title.localeCompare(b.title)),
    [categories],
  );

  const expenseCategories = useMemo(
    () => categories.filter((item) => item.expense).sort((a, b) => a.title.localeCompare(b.title)),
    [categories],
  );
  const usageCountByCategoryId = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      const categoryId = normalizeId(entry.category);
      if (!categoryId) continue;
      map.set(categoryId, (map.get(categoryId) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  if (isLoading) return null;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;

  function renderRow(kind: "income" | "expense", list: typeof categories) {
    if (list.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          Nenhuma categoria de {kind === "income" ? "receita" : "despesa"}.
        </Typography>
      );
    }

    return (
      <Stack spacing={0.8}>
        {list.map((category) => (
          <Paper
            key={category._id}
            variant="outlined"
            sx={{
              px: 1.2,
              py: 1,
              borderRadius: 1,
              boxShadow: "0 2px 10px rgba(2, 6, 23, 0.04)",
              "&:hover": {
                borderColor: category.color,
              },
              "&:hover .category-actions": {
                opacity: 1,
                pointerEvents: "auto",
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack spacing={0.45}>
                <Typography sx={{ fontWeight: 600 }}>{category.title}</Typography>
                <Chip
                  label={category.expense ? "Despesa" : "Receita"}
                  size="small"
                  variant="outlined"
                  sx={{
                    width: "fit-content",
                    height: 22,
                    borderColor: category.color,
                    bgcolor: hexToRgba(category.color, 0.14),
                    color: "text.primary",
                  }}
                />
              </Stack>

              <Stack
                className="category-actions"
                direction="row"
                spacing={0.2}
                sx={{
                  opacity: { xs: 1, md: 0.1 },
                  pointerEvents: { xs: "auto", md: "none" },
                  transition: "all 180ms ease",
                }}
              >
                <Tooltip title="Editar categoria">
                  <IconButton color="primary" size="small" onClick={() => openEdit(category)}>
                    <EditOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Excluir categoria">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => {
                      const usageCount = usageCountByCategoryId.get(category._id) ?? 0;
                      if (usageCount > 0) {
                        setUsageMessage(
                          `Nao e possivel excluir "${category.title}" porque ela esta vinculada a ${usageCount} ${usageCount === 1 ? "transação" : "transações"}.`,
                        );
                        return;
                      }

                      setUsageMessage("");
                      deleteCategory(category._id);
                    }}
                    disabled={deletingId === category._id}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.2,
        borderRadius: 1,
        boxShadow: "0 6px 18px rgba(2, 6, 23, 0.06)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 0.4, pb: 1 }}>
        <Typography variant="h6">Categorias</Typography>
        <Chip size="small" label={`${categories.length} itens`} />
      </Stack>

      {deleteMessage ? <Alert severity="error" sx={{ mb: 1 }}>{deleteMessage}</Alert> : null}
      {usageMessage ? <Alert severity="warning" sx={{ mb: 1 }}>{usageMessage}</Alert> : null}

      {categories.length === 0 ? (
        <Alert severity="info">Nenhuma categoria cadastrada.</Alert>
      ) : (
        <Stack spacing={1.3}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ px: 0.2 }}>
              RECEITAS
            </Typography>
            {renderRow("income", incomeCategories)}
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ px: 0.2 }}>
              DESPESAS
            </Typography>
            {renderRow("expense", expenseCategories)}
          </Box>
        </Stack>
      )}
    </Paper>
  );
}
