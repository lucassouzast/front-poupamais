import { useRef, useState, type ReactNode } from "react";
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
} from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { useEntriesStore } from "../../stores/entriesStore";
import EntryForm from "./EntryForm";

type EntryType = "income" | "expense";

function getTodayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

const actions: Array<{
  key: EntryType;
  label: string;
  icon: ReactNode;
}> = [
  {
    key: "income",
    label: "Receita",
    icon: <ArrowUpwardRounded sx={{ color: "success.main" }} />,
  },
  {
    key: "expense",
    label: "Despesa",
    icon: <ArrowDownwardRounded sx={{ color: "error.main" }} />,
  },
];

const morphIn = keyframes`
  0% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
`;

export default function FloatingFinanceButton() {
  const setDescription = useEntriesStore((state) => state.setDescription);
  const setValue = useEntriesStore((state) => state.setValue);
  const setDate = useEntriesStore((state) => state.setDate);
  const setCategory = useEntriesStore((state) => state.setCategory);
  const clearCreateMessage = useEntriesStore((state) => state.clearCreateMessage);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>("expense");
  const lastModalCloseAtRef = useRef(0);

  function handleOpenEntryModal(type: EntryType) {
    setEntryType(type);
    setDescription("");
    setValue("");
    setDate(getTodayISODate());
    setCategory("");
    clearCreateMessage();
    setIsExpanded(false);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    lastModalCloseAtRef.current = Date.now();
    setIsModalOpen(false);
    setIsExpanded(false);
  }

  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          if (isModalOpen) return;
          setIsExpanded(false);
        }}
      >
        <Box
          role="button"
          aria-label="Adicionar lancamento"
          aria-expanded={isExpanded}
          tabIndex={0}
          onClick={() => {
            if (isModalOpen) return;
            if (Date.now() - lastModalCloseAtRef.current < 180) return;
            if (!isExpanded) setIsExpanded(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsExpanded((prev) => !prev);
            }
            if (event.key === "Escape") {
              setIsExpanded(false);
            }
          }}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: isExpanded ? "min(228px, calc(100vw - 24px))" : 56,
            height: isExpanded ? 132 : 56,
            borderRadius: isExpanded ? "16px" : "50%",
            backgroundColor: isExpanded ? "#15803D" : "#22C55E",
            boxShadow: isExpanded
              ? "0 18px 36px rgba(10, 55, 24, 0.38)"
              : "0 12px 28px rgba(7, 57, 23, 0.34)",
            transition: "width 260ms ease-in-out, height 260ms ease-in-out, border-radius 260ms ease-in-out, background-color 260ms ease-in-out, box-shadow 260ms ease-in-out",
            animation: isExpanded ? `${morphIn} 280ms ease-in-out` : "none",
            transformOrigin: "bottom right",
            overflow: "hidden",
            cursor: "pointer",
            outline: "none",
            maxWidth: "calc(100vw - 12px)",
            "&:hover": {
              backgroundColor: isExpanded ? "#166534" : "#16A34A",
            },
            "@media (max-width:600px)": {
              right: 12,
              bottom: 12,
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "#FFFFFF",
              opacity: isExpanded ? 0 : 1,
              transform: isExpanded ? "rotate(90deg) scale(0.7)" : "rotate(0deg) scale(1)",
              transition: "opacity 220ms ease-in-out, transform 260ms ease-in-out",
              pointerEvents: "none",
              visibility: isExpanded ? "hidden" : "visible",
            }}
          >
            <AddRounded />
          </Box>

          <Box
            sx={{
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 220ms ease-in-out, transform 240ms ease-in-out",
              pointerEvents: isExpanded ? "auto" : "none",
              display: isExpanded ? "grid" : "none",
              p: 1.1,
              pt: 1.2,
              gap: 0.9,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.82)",
                fontWeight: 700,
                letterSpacing: 0.3,
                px: 0.9,
              }}
            >
              Nova transação
            </Typography>

            {actions.map((action) => (
              <ButtonBase
                key={action.key}
                onClick={(event) => {
                  event.stopPropagation();
                  handleOpenEntryModal(action.key);
                }}
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                  px: 1.1,
                  py: 0.8,
                  bgcolor: "rgba(255,255,255,0.92)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1,
                  transition: "transform 220ms ease-in-out, background-color 220ms ease-in-out",
                  "&:hover": {
                    bgcolor: "#FFFFFF",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {action.icon}
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                  {action.label}
                </Typography>
              </ButtonBase>
            ))}
          </Box>
        </Box>
      </ClickAwayListener>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        TransitionProps={{
          onExited: () => {
            setIsExpanded(false);
          },
        }}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "min(92vw, 540px)",
          },
        }}
      >
        <DialogTitle>
          {entryType === "income" ? "Nova receita" : "Nova despesa"}
        </DialogTitle>
        <DialogContent>
          <EntryForm
            embedded
            entryType={entryType}
            onSuccess={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
