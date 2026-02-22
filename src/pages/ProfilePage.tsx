import { Typography } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";

export default function ProfilePage() {
  return (
    <AppLayout>
      <Typography variant="h4" mb={2}>
        Perfil
      </Typography>

      <Typography>
        Proximo passo: carregar e editar nome/email via /users/me.
      </Typography>
    </AppLayout>
  );
}
