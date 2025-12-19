import { useState } from "react";
import LayoutAutenticado from "../components/LayoutAutenticado";
import { usePessoas } from "../hooks/usePessoas";

import "../styles/Pessoas.css";

export const Pessoas = () => {
  const { pessoas, loading, error, addPessoa, editPessoa, removePessoa } = usePessoas();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPessoa, setCurrentPessoa] = useState<{ id?: number; nome: string; idade: number }>({
    nome: "",
    idade: 0
  });

  const openModal = (pessoa?: { id: number; nome: string; idade: number }) => {
    if (pessoa) setCurrentPessoa(pessoa);
    else setCurrentPessoa({ nome: "", idade: 0 });
    setModalOpen(true);
  };

  const salvar = () => {
    if (!currentPessoa.nome.trim() || currentPessoa.idade <= 0) return;

    if (currentPessoa.id) {
      editPessoa(currentPessoa.id, currentPessoa.nome, currentPessoa.idade);
    } else {
      addPessoa(currentPessoa.nome, currentPessoa.idade);
    }

    setModalOpen(false);
    setCurrentPessoa({ nome: "", idade: 0 });
  };

  return (
    <LayoutAutenticado>
      <h1>Pessoas</h1>

      {error && <p className="error">{error}</p>}

      <button className="btn-primary" onClick={() => openModal()}>
        Nova Pessoa
      </button>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table-pessoas">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map(p => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.idade}</td>
                <td>
                  <button className="btn-edit" onClick={() => openModal(p)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => removePessoa(p.id)}>
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
            <h2>{currentPessoa.id ? "Editar Pessoa" : "Nova Pessoa"}</h2>

            <input
              type="text"
              value={currentPessoa.nome}
              onChange={e => setCurrentPessoa({ ...currentPessoa, nome: e.target.value })}
              placeholder="Nome"
            />

            <input
              type="number"
              value={currentPessoa.idade || ""}
              onChange={e => {
                const idade = parseInt(e.target.value);
                setCurrentPessoa({ ...currentPessoa, idade: isNaN(idade) ? 0 : idade });
              }}
              placeholder="Idade"
              min={1}
            />

            <div className="modal-actions">
              <button className="btn-primary" onClick={salvar}>
                Salvar
              </button>
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAutenticado>
  );
};
