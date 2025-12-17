using GastosApi.Data;
using GastosApi.Dtos;
using GastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosApi.Services
{
    public class CategoriaService
    {
        private readonly AppDbContext _context;
        public CategoriaService(AppDbContext context) => _context = context;

        // Listar todas categorias
        public async Task<List<Categoria>> ListarAsync()
        {
            return await _context.Categorias
                .Include(c => c.Transacoes)
                .ToListAsync();
        }

        // Criar categoria
        public async Task<(bool sucesso, string mensagem, Categoria? categoria)> CriarAsync(CreateCategoriaDto dto)
        {
            var categoria = new Categoria
            {
                Descricao = dto.Descricao,
                Finalidade = dto.Finalidade
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return (true, "Categoria criada com sucesso.", categoria);
        }

        // Atualizar categoria
        public async Task<(bool sucesso, string mensagem, Categoria? categoria)> AtualizarAsync(int id, CreateCategoriaDto dto)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
                return (false, "Categoria não encontrada.", null);

            categoria.Descricao = dto.Descricao;
            categoria.Finalidade = dto.Finalidade;

            await _context.SaveChangesAsync();
            return (true, "Categoria atualizada com sucesso.", categoria);
        }

        // Excluir categoria
        public async Task<(bool sucesso, string mensagem)> ExcluirAsync(int id)
        {
            var categoria = await _context.Categorias
                .Include(c => c.Transacoes)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                return (false, "Categoria não encontrada.");

            // Remover transações relacionadas antes de remover categoria
            if (categoria.Transacoes.Any())
                _context.Transacoes.RemoveRange(categoria.Transacoes);

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return (true, "Categoria excluída com sucesso.");
        }
    }
}
