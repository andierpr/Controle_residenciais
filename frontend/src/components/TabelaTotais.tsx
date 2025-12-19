import React from "react";
import { TotaisPessoa } from "../types/TotaisPessoa";

interface TabelaTotaisProps {
  titulo: string;
  totais: TotaisPessoa[];
}

export const TabelaTotais: React.FC<TabelaTotaisProps> = ({ titulo, totais }) => {
  // Calcula saldo de cada pessoa
  const totaisComSaldo = totais.map((p) => ({
    ...p,
    saldo: p.totalReceitas - p.totalDespesas, // calcula saldo aqui
  }));

  // Total geral
  const totalGeral = {
    totalReceitas: totais.reduce((sum, p) => sum + p.totalReceitas, 0),
    totalDespesas: totais.reduce((sum, p) => sum + p.totalDespesas, 0),
    saldo: totais.reduce((sum, p) => sum + (p.totalReceitas - p.totalDespesas), 0),
  };

  return (
    <div className="tabela-totais">
      <h3>{titulo}</h3>
      <table>
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Receitas</th>
            <th>Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {totaisComSaldo.map((p) => (
            <tr key={p.pessoaId}>
              <td>{p.pessoaNome}</td>
              <td>{p.totalReceitas.toFixed(2)}</td>
              <td>{p.totalDespesas.toFixed(2)}</td>
              <td className={p.saldo < 0 ? "saldo-negativo" : ""}>
                {p.saldo.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="total-geral">
            <td>Total Geral</td>
            <td>{totalGeral.totalReceitas.toFixed(2)}</td>
            <td>{totalGeral.totalDespesas.toFixed(2)}</td>
            <td className={totalGeral.saldo < 0 ? "saldo-negativo" : ""}>
              {totalGeral.saldo.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
