import { api } from "./api";

export type MeResponse = {
  _id: string;
  name: string;
  email: string;
};

export type UpdateMePayload = {
  name: string;
  email: string;
};

export async function getMeService() {
  const response = await api.get<MeResponse>("/users/me");
  return response.data;
}

export async function updateMeService(body: UpdateMePayload) {
  const response = await api.put<MeResponse>("/users/me", body);
  return response.data;
}
