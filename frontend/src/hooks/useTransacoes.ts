import { useState, useEffect } from "react";
import transacoesService, { CreateTransacaoDto } from "../api/transacoesService";
import { Transacao } from "../types/transacao";
interface UseTransacoesReturn {
  transacoes: Transacao[];
  loading: boolean;
  error: string;
  fetchTransacoes: () => Promise<void>;
  criarTransacao: (dto: CreateTransacaoDto) => Promise<Transacao>;
  editarTransacao: (id: number, dto: CreateTransacaoDto) => Promise<Transacao>;
  deletarTransacao: (id: number) => Promise<void>;
}

export function useTransacoes(): UseTransacoesReturn {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchTransacoes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await transacoesService.listar();
      setTransacoes(data);
    } catch (err: any) {
      console.error("Erro ao buscar transações:", err);
      setError(err.message || "Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  };

  const criarTransacao = async (dto: CreateTransacaoDto) => {
    setError("");
    try {
      const nova = await transacoesService.adicionar(dto);
      setTransacoes(prev => [...prev, nova]);
      return nova;
    } catch (err: any) {
      console.error("Erro ao criar transação:", err);
      setError(err.message || "Erro ao criar transação.");
      throw err;
    }
  };

  const editarTransacao = async (id: number, dto: CreateTransacaoDto) => {
    setError("");
    try {
      const atualizada = await transacoesService.atualizar(id, dto);
      setTransacoes(prev => prev.map(t => (t.id === id ? atualizada : t)));
      return atualizada;
    } catch (err: any) {
      console.error("Erro ao editar transação:", err);
      setError(err.message || "Erro ao editar transação.");
      throw err;
    }
  };

  const deletarTransacao = async (id: number) => {
    setError("");
    try {
      await transacoesService.deletar(id);
      setTransacoes(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      console.error("Erro ao deletar transação:", err);
      setError(err.message || "Erro ao deletar transação.");
      throw err;
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, []);

  return {
    transacoes,
    loading,
    error,
    fetchTransacoes,
    criarTransacao,
    editarTransacao,
    deletarTransacao,
  };
}
