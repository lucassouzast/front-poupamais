import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { LockOutlined, PersonAddAltOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginService, registerService } from "../services/authApi";
import { useAuthStore } from "../stores/authStore";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

type AuthMode = "login" | "register";

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

export default function AuthPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const authFieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(15,23,42,0.82)",
      borderRadius: 1.5,
      color: "#E2E8F0",
      "& fieldset": {
        borderColor: "rgba(148,163,184,0.32)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(148,163,184,0.55)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#22C55E",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#94A3B8",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#86EFAC",
    },
    "& .MuiOutlinedInput-input::placeholder": {
      color: "#64748B",
      opacity: 1,
    },
  };

  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [mode]);

  function handleChangeMode(_event: React.MouseEvent<HTMLElement>, next: AuthMode | null) {
    if (!next || next === mode) return;
    setMode(next);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        const data = await loginService({ email, password });
        setAuth(data.token, data.user);
        navigate("/dashboard", { replace: true });
        return;
      }

      await registerService({ name, email, password });
      setSuccessMessage("Conta criada com sucesso. Agora entre com seus dados.");
      setMode("login");
    } catch (error) {
      const fallback =
        mode === "login"
          ? "Erro ao entrar. Tente novamente."
          : "Nao foi possivel criar a conta. Verifique os dados.";
      setErrorMessage(getApiErrorMessage(error, fallback));
      if (mode === "login") {
        window.setTimeout(() => {
          passwordInputRef.current?.focus();
          passwordInputRef.current?.select();
        }, 0);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "grid",
        placeItems: "center",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 2.5, sm: 4 },
        overflow: "hidden",
        background:
          "radial-gradient(circle at 32% 58%, rgba(22,163,74,0.32) 0%, rgba(22,163,74,0) 34%), linear-gradient(160deg, #000000 0%, #16A34A 55%, #0F766E 100%)",
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="none"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.75,
          pointerEvents: "none",
        }}
      >
        <path d="M0 130 C 300 70 460 210 740 170 C 1020 130 1190 10 1440 80" fill="none" stroke="rgba(2,6,23,0.72)" strokeWidth="2.3" />
        <path d="M0 280 C 260 220 490 330 760 300 C 1030 270 1210 150 1440 220" fill="none" stroke="rgba(2,6,23,0.72)" strokeWidth="2.3" />
        <path d="M0 440 C 280 400 460 530 730 500 C 1000 470 1180 360 1440 410" fill="none" stroke="rgba(2,6,23,0.72)" strokeWidth="2.3" />
        <path d="M0 620 C 300 570 500 700 770 670 C 1020 640 1210 520 1440 590" fill="none" stroke="rgba(2,6,23,0.72)" strokeWidth="2.3" />
        <path d="M0 800 C 280 750 520 890 780 850 C 1040 810 1240 700 1440 760" fill="none" stroke="rgba(2,6,23,0.72)" strokeWidth="2.3" />
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: "min(460px, 100%)",
          p: { xs: 2, sm: 2.4 },
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.20)",
          bgcolor: "rgba(2,6,23,0.92)",
          boxShadow: "0 24px 56px rgba(2,6,23,0.56)",
          backdropFilter: "blur(3px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={1.4}>
          <Stack alignItems="center" spacing={0.6} sx={{ mb: 0.3 }}>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Typography variant="h5" sx={{ color: "#ECFDF3", fontWeight: 700 }}>
                Poupa+
              </Typography>
            </Stack>
            <Typography sx={{ color: "#E2E8F0", fontWeight: 700, fontSize: { xs: 16 , sm: 28 } }}>
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </Typography>
            <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>
              {mode === "login" ? "Insira seus dados para entrar" : "Comece a organizar suas finanças"}
            </Typography>
          </Stack>

          <ToggleButtonGroup
            exclusive
            value={mode}
            onChange={handleChangeMode}
            fullWidth
            size="small"
            sx={{
              bgcolor: "rgba(15,23,42,0.7)",
              borderRadius: 2,
              p: 0.4,
              "& .MuiToggleButton-root": {
                textTransform: "none",
                border: "none",
                color: "#CBD5E1",
                borderRadius: 1.4,
              },
              "& .Mui-selected": {
                bgcolor: "rgba(22,163,74,0.28) !important",
                color: "#DCFCE7 !important",
                fontWeight: 700,
              },
            }}
          >
            <ToggleButton value="login">Login</ToggleButton>
            <ToggleButton value="register">Registro</ToggleButton>
          </ToggleButtonGroup>

          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Box
            key={mode}
            sx={{
              animation: `${mode === "login" ? slideInFromLeft : slideInFromRight} 280ms cubic-bezier(0.2, 0.9, 0.2, 1)`,
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={1.15}>
                {mode === "register" ? (
                  <TextField
                    label="Nome"
                    fullWidth
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    sx={authFieldSx}
                  />
                ) : null}

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete={mode === "login" ? "username" : "email"}
                  disabled={isLoading}
                  sx={authFieldSx}
                />

                <TextField
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  inputRef={passwordInputRef}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  disabled={isLoading}
                  sx={authFieldSx}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" sx={{ color: "#94A3B8" }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />


                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={mode === "login" ? <LockOutlined /> : <PersonAddAltOutlined />}
                  sx={{
                    mt: 0.3,
                    py: 1.15,
                    borderRadius: 1.5,
                    fontSize: 15,
                    fontWeight: 700,
                    boxShadow: "0 14px 30px rgba(22,163,74,0.38)",
                    color: "#ECFDF3",
                  }}
                >
                  {isLoading
                    ? mode === "login"
                      ? "Entrando..."
                      : "Criando..."
                    : mode === "login"
                      ? "Login"
                      : "Criar conta"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
