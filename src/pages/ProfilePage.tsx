import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import {
  getMeService,
  updateMeService,
  updateMyEmailService,
  updateMyPasswordService,
} from "../services/usersApi";
import { useAuthStore } from "../stores/authStore";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function ProfilePage() {
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailPasswordConfirmation, setEmailPasswordConfirmation] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [profileSuccess, setProfileSuccess] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchMe() {
      setIsLoading(true);
      setProfileError("");

      try {
        const data = await getMeService();
        setName(data.name);
        setEmail(data.email);
        setUser(data);
      } catch (error) {
        setProfileError(getApiErrorMessage(error, "Erro ao carregar perfil."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchMe();
  }, [setUser]);

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!name.trim()) {
      setProfileError("Informe o nome.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const updated = await updateMeService({
        name: name.trim(),
        email,
      });

      setUser(updated);
      setProfileSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      setProfileError(getApiErrorMessage(error, "Erro ao atualizar perfil."));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    if (!newEmail.trim()) {
      setEmailError("Informe o novo email.");
      return;
    }

    if (!emailPassword) {
      setEmailError("Informe sua senha atual.");
      return;
    }

    if (!emailPasswordConfirmation) {
      setEmailError("Confirme sua senha atual.");
      return;
    }

    setIsSavingEmail(true);

    try {
      const updated = await updateMyEmailService({
        email: newEmail.trim(),
        password: emailPassword,
        passwordConfirmation: emailPasswordConfirmation,
      });

      setEmail(updated.email);
      setNewEmail("");
      setEmailPassword("");
      setEmailPasswordConfirmation("");
      setUser(updated);
      setEmailSuccess("Email atualizado com sucesso.");
    } catch (error) {
      setEmailError(getApiErrorMessage(error, "Erro ao atualizar email."));
    } finally {
      setIsSavingEmail(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword) {
      setPasswordError("Informe a senha antiga.");
      return;
    }

    if (!newPassword) {
      setPasswordError("Informe a nova senha.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await updateMyPasswordService({
        oldPassword,
        newPassword,
      });

      setOldPassword("");
      setNewPassword("");
      setPasswordSuccess("Senha atualizada com sucesso.");
    } catch (error) {
      setPasswordError(getApiErrorMessage(error, "Erro ao atualizar senha."));
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <AppLayout>
      <Typography variant="h4" mb={2}>
        Perfil
      </Typography>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 1.2 }}>
              Dados do Perfil
            </Typography>

            {isLoading ? <Alert severity="info">Carregando perfil...</Alert> : null}
            {profileError ? <Alert severity="error" sx={{ mb: 1.2 }}>{profileError}</Alert> : null}
            {profileSuccess ? <Alert severity="success" sx={{ mb: 1.2 }}>{profileSuccess}</Alert> : null}

            <Box component="form" onSubmit={handleProfileSubmit}>
              <Stack spacing={1.1}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isLoading}
                />

                <TextField label="Email atual" type="email" fullWidth value={email} disabled />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 1.2 }}
                disabled={isLoading || isSavingProfile}
              >
                {isSavingProfile ? "Salvando..." : "Salvar nome"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 1.2 }}>
              Segurança da Conta
            </Typography>

            <Box component="form" onSubmit={handleEmailSubmit}>
              <Typography variant="subtitle2" sx={{ mb: 0.8 }}>
                Trocar email
              </Typography>
              {emailError ? <Alert severity="error" sx={{ mb: 1 }}>{emailError}</Alert> : null}
              {emailSuccess ? <Alert severity="success" sx={{ mb: 1 }}>{emailSuccess}</Alert> : null}

              <Stack spacing={1}>
                <TextField
                  label="Novo email"
                  type="email"
                  fullWidth
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                />
                <TextField
                  label="Senha atual"
                  type="password"
                  fullWidth
                  value={emailPassword}
                  onChange={(event) => setEmailPassword(event.target.value)}
                />
                <TextField
                  label="Confirmar senha atual"
                  type="password"
                  fullWidth
                  value={emailPasswordConfirmation}
                  onChange={(event) => setEmailPasswordConfirmation(event.target.value)}
                />
              </Stack>

              <Button type="submit" variant="outlined" sx={{ mt: 1.2 }} disabled={isSavingEmail}>
                {isSavingEmail ? "Salvando..." : "Atualizar email"}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Typography variant="subtitle2" sx={{ mb: 0.8 }}>
                Trocar senha
              </Typography>
              {passwordError ? <Alert severity="error" sx={{ mb: 1 }}>{passwordError}</Alert> : null}
              {passwordSuccess ? <Alert severity="success" sx={{ mb: 1 }}>{passwordSuccess}</Alert> : null}

              <Stack spacing={1}>
                <TextField
                  label="Senha antiga"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                />
                <TextField
                  label="Nova senha"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </Stack>

              <Button type="submit" variant="outlined" sx={{ mt: 1.2 }} disabled={isSavingPassword}>
                {isSavingPassword ? "Salvando..." : "Atualizar senha"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
