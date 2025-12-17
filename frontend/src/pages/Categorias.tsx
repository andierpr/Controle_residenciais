import { useState } from "react";
import LayoutAutenticado from "../components/LayoutAutenticado";
import { useCategorias } from "../hooks/useCategorias";
import "../styles/Categorias.css";

export const Categorias = () => {
  const {
    categorias,
    loading,
    error,
    addCategoria,
    editCategoria,
    removeCategoria,
  } = useCategorias();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<{
    id?: number;
    descricao: string;
    finalidade: "despesa" | "receita" | "ambas";
  }>({ descricao: "", finalidade: "despesa" });

  const openModal = (categoria?: {
    id: number;
    descricao: string;
    finalidade: "despesa" | "receita" | "ambas";
  }) => {
    if (categoria) setCurrentCategoria(categoria);
    else setCurrentCategoria({ descricao: "", finalidade: "despesa" });
    setModalOpen(true);
  };

  const salvar = () => {
    if (!currentCategoria.descricao.trim()) return;

    if (currentCategoria.id) {
      editCategoria(
        currentCategoria.id,
        currentCategoria.descricao,
        currentCategoria.finalidade
      );
    } else {
      addCategoria(currentCategoria.descricao, currentCategoria.finalidade);
    }

    setModalOpen(false);
    setCurrentCategoria({ descricao: "", finalidade: "despesa" });
  };

  const mapFinalidade = (valor: number | string) => {
    if (typeof valor === "number") {
      switch (valor) {
        case 0:
          return "Receita";
        case 1:
          return "Despesa";
        case 2:
          return "Ambas";
        default:
          return "Desconhecido";
      }
    }
    return valor.charAt(0).toUpperCase() + valor.slice(1);
  };

  return (
    <LayoutAutenticado>
      <h1>Categorias</h1>
      {error && <p className="error">{error}</p>}

      <button className="btn-primary" onClick={() => openModal()}>
        Nova Categoria
      </button>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table-categorias">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Finalidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat.id}>
                <td>{cat.descricao}</td>
                <td>{mapFinalidade(cat.finalidade)}</td>
                <td>
                  <button className="btn-edit" onClick={() => openModal(cat)}>
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => removeCategoria(cat.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>
              {currentCategoria.id ? "Editar Categoria" : "Nova Categoria"}
            </h2>

            <input
              value={currentCategoria.descricao}
              onChange={e =>
                setCurrentCategoria({
                  ...currentCategoria,
                  descricao: e.target.value,
                })
              }
              placeholder="Descrição"
            />

            <select
              value={currentCategoria.finalidade}
              onChange={e =>
                setCurrentCategoria({
                  ...currentCategoria,
                  finalidade: e.target.value as
                    | "despesa"
                    | "receita"
                    | "ambas",
                })
              }
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
              <option value="ambas">Ambas</option>
            </select>

            <div className="modal-actions">
              <button className="btn-primary" onClick={salvar}>
                Salvar
              </button>
              <button
                className="btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAutenticado>
  );
};
