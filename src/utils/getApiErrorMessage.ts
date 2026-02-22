import axios from "axios";

type ApiErrorData = {
  message?: string;
  error?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return "Erro inesperado. Tente novamente.";
  }

  const status = error.response?.status;
  const data = error.response?.data as ApiErrorData | undefined;

  if (status === 409) return "Este email já está em uso.";
  if (status === 401) return "Email ou senha inválidos.";

  return data?.message || data?.error || fallback;
}
