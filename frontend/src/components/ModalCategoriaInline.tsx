import { useState } from "react";

interface ModalCategoriaInlineProps {
  tipo: "despesa" | "receita";
  onSave: (categoria: { descricao: string; finalidade: "despesa" | "receita" }) => Promise<void>;
  onClose: () => void;
}

const ModalCategoriaInline = ({ tipo, onSave, onClose }: ModalCategoriaInlineProps) => {
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    setSaving(true);
    await onSave({ descricao: descricao.trim(), finalidade: tipo });
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-inline-backdrop">
      <div className="modal-inline">
        <h3>Nova Categoria ({tipo})</h3>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Descrição da categoria"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCategoriaInline;
