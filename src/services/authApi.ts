import { api } from "./api";

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export async function loginService(body: LoginBody) {
  const response = await api.post<LoginResponse>("/auth/login", body);
  return response.data;
}

export async function registerService(body: RegisterBody) {
  const response = await api.post("/auth/register", body);
  return response.data;
}
