import { useEffect, useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import { getMeService, updateMeService } from "../services/usersApi";
import { useAuthStore } from "../stores/authStore";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function ProfilePage() {
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchMe() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getMeService();
        setName(data.name);
        setEmail(data.email);
        setUser(data);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, "Erro ao carregar perfil."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchMe();
  }, [setUser]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("Informe o nome.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Informe o email.");
      return;
    }

    setIsSaving(true);

    try {
      const updated = await updateMeService({
        name: name.trim(),
        email: email.trim(),
      });

      setUser(updated);
      setSuccessMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Erro ao atualizar perfil."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppLayout>
      <Typography variant="h4" mb={2}>
        Perfil
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, maxWidth: 560 }}>
        {isLoading ? <Alert severity="info">Carregando perfil...</Alert> : null}
        {errorMessage ? <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert> : null}
        {successMessage ? <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert> : null}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={1.2}>
            <TextField
              label="Nome"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 1.5 }}
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar alteracoes"}
          </Button>
        </Box>
      </Paper>
    </AppLayout>
  );
}
