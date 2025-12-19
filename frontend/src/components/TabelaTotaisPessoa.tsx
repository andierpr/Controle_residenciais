import React, { useMemo } from "react";
import { TotaisPessoa } from "../types/TotaisPessoa";

interface Props {
  titulo: string;
  totais: TotaisPessoa[];
}

const TabelaTotaisPessoa: React.FC<Props> = ({ titulo, totais }) => {
  const totalReceitas = useMemo(
    () => totais.reduce((s, p) => s + p.totalReceitas, 0),
    [totais]
  );

  const totalDespesas = useMemo(
    () => totais.reduce((s, p) => s + p.totalDespesas, 0),
    [totais]
  );

  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="mb-4">
      <h4>{titulo}</h4>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Pessoa</th>
            <th className="text-end">Receitas</th>
            <th className="text-end">Despesas</th>
            <th className="text-end">Saldo</th>
          </tr>
        </thead>

        <tbody>
          {totais.map((p) => {
            const saldoPessoa = p.totalReceitas - p.totalDespesas;

            return (
              <tr key={p.pessoaId}>
                <td>{p.pessoaNome}</td>
                <td className="text-end">{p.totalReceitas.toFixed(2)}</td>
                <td className="text-end">{p.totalDespesas.toFixed(2)}</td>
                <td
                  className={`text-end ${
                    saldoPessoa < 0 ? "text-danger" : "text-success"
                  }`}
                >
                  {saldoPessoa.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <th>Total Geral</th>
            <th className="text-end">{totalReceitas.toFixed(2)}</th>
            <th className="text-end">{totalDespesas.toFixed(2)}</th>
            <th
              className={`text-end ${
                saldo < 0 ? "text-danger" : "text-success"
              }`}
            >
              {saldo.toFixed(2)}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TabelaTotaisPessoa;
