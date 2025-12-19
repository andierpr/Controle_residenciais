import { useCallback, useEffect, useMemo, useState } from "react";
import transacoesService from "../api/transacoesService";
import { Transacao, CreateTransacao } from "../types/Transacao";
import { TotaisPessoa } from "../types/TotaisPessoa";
import { TotaisCategoria } from "../types/TotaisCategoria";

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [totaisPessoa, setTotaisPessoa] = useState<TotaisPessoa[]>([]);
  const [totaisCategoria, setTotaisCategoria] = useState<TotaisCategoria[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /* =========================
     🔄 BUSCAR TRANSAÇÕES
  ========================= */
  const fetchTransacoes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await transacoesService.listar();
      setTransacoes(data ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar transações";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     📊 BUSCAR TOTAIS (API)
  ========================= */
  const fetchTotais = useCallback(async () => {
    try {
      const [pessoas, categorias] = await Promise.all([
        transacoesService.totaisPorPessoa(),
        transacoesService.totaisPorCategoria(),
      ]);

      setTotaisPessoa(pessoas ?? []);
      setTotaisCategoria(categorias ?? []);
    } catch {
      // Totais são complementares — não quebram a tela
      setTotaisPessoa([]);
      setTotaisCategoria([]);
    }
  }, []);

  useEffect(() => {
    fetchTransacoes();
    fetchTotais();
  }, [fetchTransacoes, fetchTotais]);

  /* =========================
     ➕ CRIAR
  ========================= */
  const adicionarTransacao = useCallback(
    async (dto: CreateTransacao) => {
      try {
        const nova = await transacoesService.criar(dto);
        setTransacoes((prev) => [...prev, nova]);
        fetchTotais();
        return nova;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao adicionar transação";
        throw new Error(msg);
      }
    },
    [fetchTotais]
  );

  /* =========================
     ✏️ EDITAR
  ========================= */
  const editarTransacao = useCallback(
    async (id: number, dto: CreateTransacao) => {
      try {
        const atualizada = await transacoesService.atualizar(id, dto);
        setTransacoes((prev) => prev.map((t) => (t.id === id ? atualizada : t)));
        fetchTotais();
        return atualizada;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao editar transação";
        throw new Error(msg);
      }
    },
    [fetchTotais]
  );

  /* =========================
     🗑️ DELETAR
  ========================= */
  const deletarTransacao = useCallback(
    async (id: number) => {
      try {
        await transacoesService.deletar(id);
        setTransacoes((prev) => prev.filter((t) => t.id !== id));
        fetchTotais();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao deletar transação";
        throw new Error(msg);
      }
    },
    [fetchTotais]
  );

  /* =========================
     📈 TOTAIS GERAIS
  ========================= */
  const totalReceitas = useMemo(
    () => totaisPessoa.reduce((sum, p) => sum + (p.totalReceitas ?? 0), 0),
    [totaisPessoa]
  );

  const totalDespesas = useMemo(
    () => totaisPessoa.reduce((sum, p) => sum + (p.totalDespesas ?? 0), 0),
    [totaisPessoa]
  );

  const saldo = useMemo(() => totalReceitas - totalDespesas, [totalReceitas, totalDespesas]);

  /* =========================
     🔁 RETORNO
  ========================= */
  return {
    transacoes,
    totaisPessoa,
    totaisCategoria,

    totalReceitas,
    totalDespesas,
    saldo,

    loading,
    error,

    adicionarTransacao,
    editarTransacao,
    deletarTransacao,
  };
}
