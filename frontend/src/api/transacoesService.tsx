import axios, { AxiosError } from "axios";
import { Transacao, CreateTransacao } from "../types/Transacao";
import { TotaisPessoa } from "../types/TotaisPessoa";
import { TotaisCategoria } from "../types/TotaisCategoria";

const API_URL = "https://localhost:7243/api/transacoes";

const transacoesService = {
  /* =========================
     🔄 LISTAR
  ========================= */
  async listar(): Promise<Transacao[]> {
    try {
      const res = await axios.get<Transacao[]>(API_URL);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message ?? "Erro ao listar transações");
    }
  },

  /* =========================
     🔍 OBTER POR ID
  ========================= */
  async obterPorId(id: number): Promise<Transacao> {
    try {
      const res = await axios.get<Transacao>(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message ?? "Erro ao buscar transação");
    }
  },

  /* =========================
     ➕ CRIAR
  ========================= */
  async criar(dto: CreateTransacao): Promise<Transacao> {
    try {
      const res = await axios.post<Transacao>(API_URL, dto);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message ?? "Erro ao criar transação");
    }
  },

  /* =========================
     ✏️ ATUALIZAR
  ========================= */
  async atualizar(id: number, dto: CreateTransacao): Promise<Transacao> {
    try {
      const res = await axios.put<Transacao>(`${API_URL}/${id}`, dto);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message ?? "Erro ao atualizar transação");
    }
  },

  /* =========================
     🗑️ DELETAR
  ========================= */
  async deletar(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message ?? "Erro ao deletar transação");
    }
  },

  /* =========================
     📊 TOTAIS POR PESSOA
  ========================= */
  async totaisPorPessoa(): Promise<TotaisPessoa[]> {
    try {
      const res = await axios.get<TotaisPessoa[]>(`${API_URL}/totais-por-pessoa`);
      return res.data;
    } catch {
      return [];
    }
  },

  /* =========================
     📊 TOTAIS POR CATEGORIA
  ========================= */
  async totaisPorCategoria(): Promise<TotaisCategoria[]> {
    try {
      const res = await axios.get<TotaisCategoria[]>(`${API_URL}/totais-por-categoria`);
      return res.data;
    } catch {
      return [];
    }
  },
};

export default transacoesService;
