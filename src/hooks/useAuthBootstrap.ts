import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuthStore } from "../stores/authStore";

type MeResponse = {
  _id: string;
  name: string;
  email: string;
};

export function useAuthBootstrap() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setIsReady(true);
        return;
      }

      if (user) {
        setIsReady(true);
        return;
      }

      try {
        const response = await api.get<MeResponse>("/users/me");
        setAuth(token, response.data);
      } catch {
        clearAuth();
      } finally {
        setIsReady(true);
      }
    }

    bootstrap();
  }, [token, user, setAuth, clearAuth]);

  return { isReady };
}
