export interface Transacao {
  id: number;
  pessoaId: number;
  pessoaNome: string;
  categoriaId: number;
  categoriaDescricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  dataTransacao: string;
  descricao?: string;
}

export interface CreateTransacao {
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  pessoaId: number;
  categoriaId: number;
}
