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

export type UpdateEmailPayload = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type UpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export async function getMeService() {
  const response = await api.get<MeResponse>("/users/me");
  return response.data;
}

export async function updateMeService(body: UpdateMePayload) {
  const response = await api.put<MeResponse>("/users/me", body);
  return response.data;
}

export async function updateMyEmailService(body: UpdateEmailPayload) {
  const response = await api.patch<MeResponse>("/users/me/email", body);
  return response.data;
}

export async function updateMyPasswordService(body: UpdatePasswordPayload) {
  await api.patch("/users/me/password", body);
}
