import api from "./api";
import { Categoria } from "../types/Categoria";

// Map do frontend para enum numérico do backend
const finalidadeMap: Record<"receita" | "despesa" | "ambas", number> = {
  receita: 0, // Receita = 0
  despesa: 1, // Despesa = 1
  ambas: 2,   // Ambas = 2
};

export const listarCategorias = async (): Promise<Categoria[]> => {
  const response = await api.get("/categorias");
  return response.data;
};

export const criarCategoria = async (
  descricao: string,
  finalidade: "despesa" | "receita" | "ambas"
): Promise<Categoria> => {
  const response = await api.post("/categorias", {
    descricao,
    finalidade: finalidadeMap[finalidade],
  });
  return response.data.categoria ?? response.data;
};

export const atualizarCategoria = async (
  id: number,
  descricao: string,
  finalidade: "despesa" | "receita" | "ambas"
): Promise<Categoria> => {
  const response = await api.put(`/categorias/${id}`, {
    descricao,
    finalidade: finalidadeMap[finalidade],
  });
  return response.data.categoria ?? response.data;
};

export const excluirCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`);
};
