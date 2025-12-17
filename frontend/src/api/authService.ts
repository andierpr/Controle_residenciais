import api from "./api";

export const loginRequest = async (email: string, senha: string) => {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
};
