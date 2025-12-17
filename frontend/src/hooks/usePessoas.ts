import { useEffect, useState } from "react";
import { Pessoa } from "../types/Pessoa";
import {
  listarPessoas,
  criarPessoa,
  atualizarPessoa,
  excluirPessoa
} from "../api/pessoasService";

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados: Pessoa[] = await listarPessoas();
      setPessoas(dados);
    } catch (err: any) {
      setError("Erro ao carregar pessoas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addPessoa = async (nome: string, idade: number) => {
    setError(null);
    try {
      await criarPessoa(nome, idade);
      await carregar();
    } catch (err: any) {
      setError("Erro ao criar pessoa");
      console.error(err);
    }
  };

  const editPessoa = async (id: number, nome: string, idade: number) => {
    setError(null);
    try {
      await atualizarPessoa(id, nome, idade);
      await carregar();
    } catch (err: any) {
      setError("Erro ao atualizar pessoa");
      console.error(err);
    }
  };

  const removePessoa = async (id: number) => {
    setError(null);
    try {
      await excluirPessoa(id);
      setPessoas(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError("Erro ao excluir pessoa");
      console.error(err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return {
    pessoas,
    loading,
    error,
    addPessoa,
    editPessoa,
    removePessoa,
    recarregar: carregar,
  };
}



// import { useEffect, useState } from "react";
// import { Pessoa } from "../types/Pessoa";
// import {
//   listarPessoas,
//   criarPessoa,
//   atualizarPessoa,
//   excluirPessoa
// } from "../api/pessoasService";

// export function usePessoas() {
//   const [pessoas, setPessoas] = useState<Pessoa[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const carregar = async () => {
//     setLoading(true);
//     try {
//       const dados = await listarPessoas();
//       setPessoas(dados);
//     } catch (err) {
//       setError("Erro ao carregar pessoas");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addPessoa = async (nome: string, idade: number) => {
//     try {
//       await criarPessoa(nome, idade);
//       await carregar();
//     } catch (err) {
//       setError("Erro ao criar pessoa");
//       console.error(err);
//     }
//   };

//   const editPessoa = async (id: number, nome: string, idade: number) => {
//     try {
//       await atualizarPessoa(id, nome, idade);
//       await carregar();
//     } catch (err) {
//       setError("Erro ao atualizar pessoa");
//       console.error(err);
//     }
//   };

//   const removePessoa = async (id: number) => {
//     try {
//       await excluirPessoa(id);
//       setPessoas(prev => prev.filter(p => p.id !== id));
//     } catch (err) {
//       setError("Erro ao excluir pessoa");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     carregar();
//   }, []);

//   return {
//     pessoas,
//     loading,
//     error,
//     addPessoa,
//     editPessoa,
//     removePessoa,
//     recarregar: carregar
//   };
// }
