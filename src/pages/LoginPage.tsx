import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Fade,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { loginService } from "../services/authApi";
import { useAuthStore } from "../stores/authStore";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

type LoginLocationState = {
  justRegistered?: boolean;
  prefillEmail?: string;
  prefillPassword?: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const state = (location.state as LoginLocationState | null) ?? null;
    if (!state?.justRegistered) return;

    setEmail(state.prefillEmail ?? "");
    setPassword(state.prefillPassword ?? "");
    setSuccessMessage("Conta criada com sucesso. Revise e clique em Entrar.");
  }, [location.state]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await loginService({ email, password });
      setAuth(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Erro ao entrar. Tente novamente."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box p={3} maxWidth={420} mx="auto">
      <Typography variant="h4" mb={2}>
        Login
      </Typography>

      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <Fade in timeout={450}>
        <Box component="form" mt={2} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TextField
            label="Senha"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </Box>
      </Fade>

      <Typography mt={2}>
        Ainda nao tem conta?{" "}
        <Button component={RouterLink} to="/register" size="small">
          Criar conta
        </Button>
      </Typography>
    </Box>
  );
}
