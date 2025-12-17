export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "despesa" | "receita";
  dataTransacao: string;
  pessoaId: number;
  categoriaId: number;
}

// Tipo usado para criar ou atualizar transações (sem o id)
export interface CreateTransacao {
  descricao: string;
  valor: number;
  tipo: "despesa" | "receita";
  pessoaId: number;
  categoriaId: number;
}
