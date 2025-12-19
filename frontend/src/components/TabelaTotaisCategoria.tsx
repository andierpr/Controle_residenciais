// src/components/TabelaTotaisCategoria.tsx
import React from "react";
import { TotaisCategoria } from "../types/TotaisCategoria";

interface TabelaTotaisCategoriaProps {
  totais: TotaisCategoria[];
  titulo?: string; // ✅ adiciona titulo como opcional
}

export function TabelaTotaisCategoria({ totais, titulo }: TabelaTotaisCategoriaProps) {
  if (!totais || totais.length === 0) return <p>Nenhuma categoria encontrada.</p>;

  const totalGeral = totais.reduce((sum, t) => sum + (t.total ?? 0), 0);

  return (
    <div className="table-container">
      {titulo && <h3>{titulo}</h3>} {/* renderiza título se existir */}
      <table className="table-totais">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {totais.map((t) => (
            <tr key={t.categoriaId}>
              <td>{t.categoriaNome}</td>
              <td>{(t.total ?? 0).toFixed(2)}</td>
            </tr>
          ))}
          <tr className="total-geral">
            <td>Total Geral</td>
            <td>{totalGeral.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
