import api from "./api";
import { Pessoa } from "../types/Pessoa";

// Listar todas as pessoas
export const listarPessoas = async (): Promise<Pessoa[]> => {
  const response = await api.get("/Pessoas");
  return response.data;
};

// Criar nova pessoa
export const criarPessoa = async (nome: string, idade: number): Promise<Pessoa> => {
  const response = await api.post("/Pessoas", { nome, idade });
  return response.data.pessoa ?? response.data;
};

// Atualizar pessoa existente
export const atualizarPessoa = async (
  id: number,
  nome: string,
  idade: number
): Promise<Pessoa> => {
  const response = await api.put(`/Pessoas/${id}`, { nome, idade });
  return response.data.pessoa ?? response.data;
};

// Excluir pessoa
export const excluirPessoa = async (id: number): Promise<void> => {
  await api.delete(`/Pessoas/${id}`);
};
