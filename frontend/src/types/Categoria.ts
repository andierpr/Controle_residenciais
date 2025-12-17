export interface Categoria {
  id: number;
  descricao: string;
  finalidade: "despesa" | "receita" | "ambas";
}
