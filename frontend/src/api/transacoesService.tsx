import axios from "axios";
import { Transacao } from "../types/transacao";

const API_URL = "https://localhost:7243/api/transacoes";

export interface CreateTransacaoDto {
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  pessoaId: number;
  categoriaId: number;
}

const transacoesService = {
  listar: async (): Promise<Transacao[]> => {
    try {
      const res = await axios.get<Transacao[]>(API_URL);
      return res.data;
    } catch (err: any) {
      console.error("Erro ao listar transações:", err);
      throw new Error(err.response?.data?.message || "Erro ao listar transações.");
    }
  },

  adicionar: async (dto: CreateTransacaoDto): Promise<Transacao> => {
    try {
      const res = await axios.post<Transacao>(API_URL, dto);
      return res.data;
    } catch (err: any) {
      console.error("Erro ao adicionar transação:", err);
      throw new Error(err.response?.data?.message || "Erro ao adicionar transação.");
    }
  },

  atualizar: async (id: number, dto: CreateTransacaoDto): Promise<Transacao> => {
    try {
      const res = await axios.put<Transacao>(`${API_URL}/${id}`, dto);
      return res.data;
    } catch (err: any) {
      console.error("Erro ao atualizar transação:", err);
      throw new Error(err.response?.data?.message || "Erro ao atualizar transação.");
    }
  },

  deletar: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (err: any) {
      console.error("Erro ao deletar transação:", err);
      throw new Error(err.response?.data?.message || "Erro ao deletar transação.");
    }
  },
};

export default transacoesService;
