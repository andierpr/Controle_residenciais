import { useEffect, useState } from "react";
import { CreateTransacao } from "../types/Transacao";
import { usePessoas } from "../hooks/usePessoas";
import { useCategorias } from "../hooks/useCategorias";

import "../components/css/ModalTransacao.css";

export interface ModalTransacaoProps {
  transacao?: CreateTransacao | null;
  onSave: (data: CreateTransacao) => Promise<void>;
  onClose: () => void;
  onAddCategoria?: (tipo: "receita" | "despesa") => void;
}

const ModalTransacao = ({
  transacao,
  onSave,
  onClose,
  onAddCategoria,
}: ModalTransacaoProps) => {
  const { pessoas } = usePessoas();
  const { categorias } = useCategorias();

  const [form, setForm] = useState<CreateTransacao>({
    descricao: "",
    valor: 0,
    tipo: "despesa",
    pessoaId: 0,
    categoriaId: 0,
  });

  const [saving, setSaving] = useState(false);

  // ============================
  // CARREGAR DADOS (EDITAR)
  // ============================
  useEffect(() => {
    if (transacao) {
      setForm(transacao);
    }
  }, [transacao]);

  // ============================
  // REGRA MENOR DE IDADE
  // ============================
  useEffect(() => {
    const pessoa = pessoas.find((p) => p.id === form.pessoaId);

    if (
      pessoa?.idade !== undefined &&
      pessoa.idade < 18 &&
      form.tipo === "receita"
    ) {
      setForm((prev) => ({ ...prev, tipo: "despesa" }));
    }
  }, [form.pessoaId, form.tipo, pessoas]);

  // ============================
  // AJUSTE AUTOMÁTICO DE CATEGORIA COMPATÍVEL
  // ============================
  useEffect(() => {
    if (!categorias.length) return;

    const categoriaAtual = categorias.find(
      (c) => c.id === form.categoriaId
    );

    // Se já existe categoria válida e compatível, não mexe
    if (categoriaAtual && categoriaAtual.finalidade === form.tipo) {
      return;
    }

    const categoriaCompativel = categorias.find(
      (c) => c.finalidade === form.tipo
    );

    setForm((prev) => ({
      ...prev,
      categoriaId: categoriaCompativel ? categoriaCompativel.id : 0,
    }));
  }, [form.tipo, categorias]);

  // ============================
  // HANDLERS
  // ============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "valor" || name === "pessoaId" || name === "categoriaId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pessoaSelecionada = pessoas.find((p) => p.id === form.pessoaId);
    if (!pessoaSelecionada) {
      alert("Selecione uma pessoa válida.");
      return;
    }

    if (form.valor <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    if (!form.descricao.trim()) {
      alert("Informe uma descrição.");
      return;
    }

    const categoriaSelecionada = categorias.find(
      (c) => c.id === form.categoriaId
    );
    if (!categoriaSelecionada) {
      alert("Selecione uma categoria válida.");
      return;
    }

    setSaving(true);
    try {
      const payload: CreateTransacao = {
        ...form,
        tipo: form.tipo as "despesa" | "receita",
        descricao: form.descricao.trim(),
        valor: Number(form.valor.toFixed(2)),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      alert(
        "Não foi possível salvar a transação. Verifique os dados e tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const menorDeIdade =
    (pessoas.find((p) => p.id === form.pessoaId)?.idade ?? 0) < 18;

  // ============================
  // FILTRO DE CATEGORIAS COMPATÍVEIS
  // ============================
  const categoriasCompatíveis = categorias.filter(
    (c) => c.finalidade === form.tipo
  );

  const semCategoriaCompatível = categoriasCompatíveis.length === 0;

  // ============================
  // RENDER
  // ============================
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2>{transacao ? "Editar Transação" : "Nova Transação"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
            required
          />

          <input
            name="valor"
            type="number"
            step="0.01"
            value={form.valor}
            onChange={handleChange}
            required
          />

          <select
            name="pessoaId"
            value={form.pessoaId}
            onChange={handleChange}
            required
          >
            <option value={0}>Selecione a pessoa</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.idade} anos)
              </option>
            ))}
          </select>

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            disabled={menorDeIdade}
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>

          {semCategoriaCompatível ? (
            <div className="no-categoria-warning">
              <p style={{ color: "red", fontWeight: "bold" }}>
                Nenhuma categoria compatível encontrada para este tipo.
              </p>

              {onAddCategoria && (
                <button
                  type="button"
                  onClick={() =>
                    onAddCategoria(form.tipo as "receita" | "despesa")
                  }
                >
                  Adicionar Categoria Compatível
                </button>
              )}
            </div>
          ) : (
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              required
            >
              <option value={0}>Selecione a categoria</option>
              {categoriasCompatíveis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descricao}
                </option>
              ))}
            </select>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" disabled={saving || semCategoriaCompatível}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTransacao;
