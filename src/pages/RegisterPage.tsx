import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { registerService } from "../services/authApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await registerService({ name, email, password });

      setSuccessMessage("Conta criada com sucesso. Redirecionando para login...");
      setTimeout(
        () =>
          navigate("/login", {
            replace: true,
            state: {
              justRegistered: true,
              prefillEmail: email,
              prefillPassword: password,
            },
          }),
        500,
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Nao foi possivel criar a conta. Verifique os dados."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box p={3} maxWidth={420} mx="auto">
      <Typography variant="h4" mb={2}>
        Registro
      </Typography>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

      <Box component="form" mt={2} onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

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
          {isLoading ? "Criando..." : "Criar conta"}
        </Button>
      </Box>

      <Typography mt={2}>
        Ja tem conta?{" "}
        <Button component={RouterLink} to="/login" size="small">
          Ir para login
        </Button>
      </Typography>
    </Box>
  );
}
