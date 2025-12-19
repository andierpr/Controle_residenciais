import React from "react";
import { Transacao } from "../types/Transacao";

interface TabelaTransacoesProps {
  transacoes: Transacao[];
  onEditar: (transacao: Transacao) => void;
  onDeletar: (id: number) => void;
}

const TabelaTransacoes: React.FC<TabelaTransacoesProps> = ({
  transacoes,
  onEditar,
  onDeletar,
}) => {
  if (!transacoes || transacoes.length === 0) {
    return <p>Nenhuma transação encontrada.</p>;
  }

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Descrição</th>
          <th className="text-end">Valor</th>
          <th>Tipo</th>
          <th>Pessoa</th>
          <th>Categoria</th>
          <th>Data</th>
          <th className="text-center">Ações</th>
        </tr>
      </thead>

      <tbody>
        {transacoes.map((t) => {
          const tipoLabel =
            t.tipo === "receita" ? "Receita" : "Despesa";

          return (
            <tr key={t.id}>
              <td>{t.id}</td>

              <td>{t.descricao}</td>

              <td className="text-end">
                {t.valor.toFixed(2)}
              </td>

              <td>
                <span
                  className={`badge ${
                    t.tipo === "receita"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {tipoLabel}
                </span>
              </td>

              <td>{t.pessoaNome}</td>

              <td>{t.categoriaDescricao}</td>

              <td>
                {new Date(t.dataTransacao).toLocaleDateString()}
              </td>

              <td className="text-center">
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => onEditar(t)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDeletar(t.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TabelaTransacoes;
