import { Backdrop, CircularProgress } from "@mui/material";

type PageLoadingOverlayProps = {
  open: boolean;
};

export default function PageLoadingOverlay({ open }: PageLoadingOverlayProps) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 999,
        color: "primary.main",
        bgcolor: "rgba(11, 15, 20, 0.28)",
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
