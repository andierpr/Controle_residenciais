import { useEffect, useState } from "react";
import {
  listarCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
} from "../api/categoriasService";
import { Categoria } from "../types/Categoria";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await listarCategorias();
      setCategorias(dados);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar categorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCategoria = async (
    descricao: string,
    finalidade: "despesa" | "receita" | "ambas"
  ) => {
    setError(null);
    try {
      const categoria = await criarCategoria(descricao, finalidade);
      setCategorias(prev => [...prev, categoria]);
    } catch (err: any) {
      setError(err.message || "Erro ao criar categoria");
      console.error(err);
    }
  };

  const editCategoria = async (
    id: number,
    descricao: string,
    finalidade: "despesa" | "receita" | "ambas"
  ) => {
    setError(null);
    try {
      const categoriaAtualizada = await atualizarCategoria(id, descricao, finalidade);
      setCategorias(prev =>
        prev.map(c => (c.id === id ? categoriaAtualizada : c))
      );
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar categoria");
      console.error(err);
    }
  };

  const removeCategoria = async (id: number) => {
    setError(null);
    try {
      await excluirCategoria(id);
      setCategorias(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao excluir categoria");
      console.error(err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return {
    categorias,
    loading,
    error,
    addCategoria,
    editCategoria,
    removeCategoria,
    recarregar: carregar,
  };
}
