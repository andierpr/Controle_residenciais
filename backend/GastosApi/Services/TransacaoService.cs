using GastosApi.Data;
using GastosApi.Dtos;
using GastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosApi.Services
{
    public class TransacaoService
    {
        private readonly AppDbContext _context;

        public TransacaoService(AppDbContext context)
        {
            _context = context;
        }

        // Listar todas as transações como DTO
        public async Task<List<TransacaoDto>> ListarAsync()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .AsNoTracking()
                .ToListAsync();

            return transacoes.Select(t => new TransacaoDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                DataTransacao = t.DataTransacao,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa!.Nome,
                CategoriaId = t.CategoriaId,
                CategoriaDescricao = t.Categoria!.Descricao
            }).ToList();
        }

        // Obter transação por ID
        public async Task<TransacaoDto?> ObterPorIdAsync(int id)
        {
            var transacao = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transacao == null) return null;

            return new TransacaoDto
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                DataTransacao = transacao.DataTransacao,
                PessoaId = transacao.PessoaId,
                PessoaNome = transacao.Pessoa!.Nome,
                CategoriaId = transacao.CategoriaId,
                CategoriaDescricao = transacao.Categoria!.Descricao
            };
        }

        // Criar nova transação com validações
        public async Task<TransacaoDto?> CriarAsync(CreateTransacaoDto dto)
        {
            var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
            if (pessoa == null) return null;

            var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
            if (categoria == null) return null;

            if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
                return null;

            if ((dto.Tipo == TipoTransacao.Receita && categoria.Finalidade == FinalidadeCategoria.Despesa) ||
                (dto.Tipo == TipoTransacao.Despesa && categoria.Finalidade == FinalidadeCategoria.Receita))
            {
                return null;
            }

            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                DataTransacao = DateTime.UtcNow,
                PessoaId = dto.PessoaId,
                CategoriaId = dto.CategoriaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return new TransacaoDto
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                DataTransacao = transacao.DataTransacao,
                PessoaId = pessoa.Id,
                PessoaNome = pessoa.Nome,
                CategoriaId = categoria.Id,
                CategoriaDescricao = categoria.Descricao
            };
        }

        // Atualizar transação
        public async Task<TransacaoDto?> AtualizarAsync(int id, CreateTransacaoDto dto)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null) return null;

            var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
            if (pessoa == null) return null;

            var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
            if (categoria == null) return null;

            if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
                return null;

            if ((dto.Tipo == TipoTransacao.Receita && categoria.Finalidade == FinalidadeCategoria.Despesa) ||
                (dto.Tipo == TipoTransacao.Despesa && categoria.Finalidade == FinalidadeCategoria.Receita))
            {
                return null;
            }

            transacao.Descricao = dto.Descricao;
            transacao.Valor = dto.Valor;
            transacao.Tipo = dto.Tipo;
            transacao.PessoaId = dto.PessoaId;
            transacao.CategoriaId = dto.CategoriaId;

            await _context.SaveChangesAsync();

            return new TransacaoDto
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                DataTransacao = transacao.DataTransacao,
                PessoaId = pessoa.Id,
                PessoaNome = pessoa.Nome,
                CategoriaId = categoria.Id,
                CategoriaDescricao = categoria.Descricao
            };
        }

        // Deletar transação
        public async Task<bool> DeletarAsync(int id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null) return false;

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();
            return true;
        }

        // Totais por pessoa
        public async Task<List<PessoaTotaisDto>> TotaisPorPessoaAsync()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .AsNoTracking()
                .ToListAsync();

            return pessoas.Select(p => new PessoaTotaisDto
            {
                PessoaId = p.Id,
                PessoaNome = p.Nome,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                        p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToList();
        }

        // Totais por categoria
        public async Task<List<CategoriaTotaisDto>> TotaisPorCategoriaAsync()
        {
            var categorias = await _context.Categorias
                .Include(c => c.Transacoes)
                .AsNoTracking()
                .ToListAsync();

            return categorias.Select(c => new CategoriaTotaisDto
            {
                CategoriaId = c.Id,
                CategoriaDescricao = c.Descricao,
                TotalReceitas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                        c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToList();
        }
    }
}
