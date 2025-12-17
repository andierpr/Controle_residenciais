import React, { useState } from "react";
import { useTransacoes } from "../hooks/useTransacoes";
import { usePessoas } from "../hooks/usePessoas";
import { useCategorias } from "../hooks/useCategorias";
import { Transacao } from "../types/transacao";
import "../styles/Transacoes.css";

export const Transacoes: React.FC = () => {
  const { transacoes, loading, error, criarTransacao, editarTransacao, deletarTransacao } = useTransacoes();
  const { pessoas, loading: loadingPessoas } = usePessoas();
  const { categorias, loading: loadingCategorias } = useCategorias();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState<{
    descricao: string;
    valor: number;
    tipo: "receita" | "despesa";
    pessoaId: number;
    categoriaId: number;
  }>({
    descricao: "",
    valor: 0,
    tipo: "receita",
    pessoaId: 0,
    categoriaId: 0,
  });

  const openModal = (t?: Transacao) => {
    if (t) {
      setEditId(t.id);
      setForm({
        descricao: t.descricao,
        valor: t.valor,
        tipo: t.tipo,
        pessoaId: t.pessoaId,
        categoriaId: t.categoriaId,
      });
    } else {
      setEditId(null);
      setForm({
        descricao: "",
        valor: 0,
        tipo: "receita",
        pessoaId: 0,
        categoriaId: 0,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const pessoa = pessoas.find(p => p.id === form.pessoaId);
    const categoria = categorias.find(c => c.id === form.categoriaId);

    if (!form.descricao.trim()) return alert("Descrição é obrigatória.");
    if (form.valor <= 0) return alert("O valor deve ser maior que zero.");
    if (!pessoa) return alert("Selecione uma pessoa válida.");
    if (!categoria) return alert("Selecione uma categoria válida.");
    if (pessoa.idade < 18 && form.tipo === "receita")
      return alert("Pessoa menor de idade só pode ter despesas.");
    if (categoria.finalidade !== form.tipo && categoria.finalidade !== "ambas")
      return alert("Categoria selecionada não é compatível com o tipo da transação.");

    try {
      if (editId !== null) {
        await editarTransacao(editId, form);
      } else {
        await criarTransacao(form);
      }
      setShowModal(false);
    } catch {
      // erro já tratado no hook
    }
  };

  if (loading || loadingPessoas || loadingCategorias) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="transacoes-container">
      <button onClick={() => openModal()}>Nova Transação</button>

      <table className="table-transacoes">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Pessoa</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map(t => {
            const pessoa = pessoas.find(p => p.id === t.pessoaId);
            const categoria = categorias.find(c => c.id === t.categoriaId);
            return (
              <tr key={t.id}>
                <td>{t.descricao}</td>
                <td>{t.valor.toFixed(2)}</td>
                <td>{t.tipo}</td>
                <td>{pessoa ? pessoa.nome : "N/A"}</td>
                <td>{categoria ? categoria.descricao : "N/A"}</td>
                <td>
                  <button onClick={() => openModal(t)}>Editar</button>
                  <button onClick={() => deletarTransacao(t.id)}>Excluir</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editId ? "Editar Transação" : "Nova Transação"}</h2>

            <input
              type="text"
              placeholder="Descrição"
              value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
            />
            <input
              type="number"
              placeholder="Valor"
              value={form.valor}
              onChange={e => setForm({ ...form, valor: Number(e.target.value) || 0 })}
            />

            <select
              value={form.tipo}
              onChange={e => setForm({ ...form, tipo: e.target.value as "receita" | "despesa" })}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <select
              value={form.pessoaId}
              onChange={e => setForm({ ...form, pessoaId: Number(e.target.value) })}
            >
              <option value={0}>Selecione uma pessoa</option>
              {pessoas.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.idade} anos)
                </option>
              ))}
            </select>

            <select
              value={form.categoriaId}
              onChange={e => setForm({ ...form, categoriaId: Number(e.target.value) })}
            >
              <option value={0}>Selecione uma categoria</option>
              {categorias
                .filter(c => c.finalidade === form.tipo || c.finalidade === "ambas" || c.id === form.categoriaId)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.descricao}
                  </option>
                ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleSave}>Salvar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
