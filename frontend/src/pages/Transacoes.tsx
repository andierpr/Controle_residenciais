import { useState } from "react";
import { useTransacoes } from "../hooks/useTransacoes";
import ModalTransacao from "../components/ModalTransacao";
import TabelaTransacoes from "../components/TabelaTransacoes";
import { TabelaTotais } from "../components/TabelaTotais";
import { TabelaTotaisCategoria } from "../components/TabelaTotaisCategoria";
import LayoutAutenticado from "../components/LayoutAutenticado";

import "../styles/Transacoes.css";
import { Transacao, CreateTransacao } from "../types/Transacao";

const Transacoes = () => {
  const {
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
  } = useTransacoes();

  const [modalAberto, setModalAberto] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [transacaoSelecionada, setTransacaoSelecionada] =
    useState<CreateTransacao | null>(null);

  /* =========================
     ABRIR MODAL PARA NOVA TRANSAÇÃO
  ========================= */
  const handleAdicionar = () => {
    setIdEditando(null);
    setTransacaoSelecionada(null);
    setModalAberto(true);
  };

  /* =========================
     ABRIR MODAL PARA EDIÇÃO
  ========================= */
  const handleEditar = (transacao: Transacao) => {
    setIdEditando(transacao.id);
    setTransacaoSelecionada({
      descricao: transacao.descricao ?? "",
      valor: transacao.valor,
      tipo: transacao.tipo,
      pessoaId: transacao.pessoaId,
      categoriaId: transacao.categoriaId,
    });
    setModalAberto(true);
  };

  /* =========================
     SALVAR TRANSAÇÃO (CRIAR OU EDITAR)
  ========================= */
  const handleSave = async (data: CreateTransacao) => {
    try {
      if (idEditando !== null) {
        await editarTransacao(idEditando, data);
      } else {
        await adicionarTransacao(data);
      }
      setModalAberto(false);
      setIdEditando(null);
      setTransacaoSelecionada(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar transação.";
      alert(msg);
    }
  };

  /* =========================
     DELETAR TRANSAÇÃO
  ========================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta transação?")) return;

    try {
      await deletarTransacao(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao deletar transação.";
      alert(msg);
    }
  };

  return (
    <LayoutAutenticado>
      <div className="transacoes-page">
        <h1>Transações</h1>

        {loading && <p>Carregando...</p>}
        {error && <p className="error">{error}</p>}

        <button onClick={handleAdicionar} className="btn btn-primary mb-3">
          Adicionar Transação
        </button>

        {!loading && (
          <div className="totais-gerais mb-4">
            <h3>Totais Gerais</h3>
            <p>Receitas: {totalReceitas.toFixed(2)}</p>
            <p>Despesas: {totalDespesas.toFixed(2)}</p>
            <p className={saldo < 0 ? "saldo-negativo" : ""}>
              Saldo: {saldo.toFixed(2)}
            </p>
          </div>
        )}

        {/* Tabelas de totais */}
        <TabelaTotais titulo="Totais por Pessoa" totais={totaisPessoa} />
        <TabelaTotaisCategoria
          titulo="Totais por Categoria"
          totais={totaisCategoria}
        />

        {/* Tabela de transações */}
        <TabelaTransacoes
          transacoes={transacoes}
          onEditar={handleEditar}
          onDeletar={handleDelete}
        />

        {/* Modal para criar/editar transações */}
        {modalAberto && (
          <ModalTransacao
            transacao={transacaoSelecionada}
            onSave={handleSave}
            onClose={() => setModalAberto(false)}
          />
        )}
      </div>
    </LayoutAutenticado>
  );
};

export default Transacoes;
