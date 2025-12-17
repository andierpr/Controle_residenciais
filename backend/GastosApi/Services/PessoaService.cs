using GastosApi.Data;
using GastosApi.Dtos;
using GastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosApi.Services
{
    public class PessoaService
    {
        private readonly AppDbContext _context;
        public PessoaService(AppDbContext context) => _context = context;

        public async Task<List<Pessoa>> ListarAsync()
        {
            return await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();
        }

        public async Task<(bool sucesso, string mensagem, Pessoa? pessoa)> CriarAsync(CreatePessoaDto dto)
        {
            var pessoa = new Pessoa
            {
                Nome = dto.Nome,
                Idade = dto.Idade
            };

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            return (true, "Pessoa criada com sucesso.", pessoa);
        }

        public async Task<(bool sucesso, string mensagem, Pessoa? pessoa)> AtualizarAsync(int id, CreatePessoaDto dto)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
                return (false, "Pessoa não encontrada", null);

            pessoa.Nome = dto.Nome;
            pessoa.Idade = dto.Idade;

            _context.Pessoas.Update(pessoa);
            await _context.SaveChangesAsync();

            return (true, "Pessoa atualizada com sucesso", pessoa);
        }

        public async Task<(bool sucesso, string mensagem)> DeletarAsync(int id)
        {
            var pessoa = await _context.Pessoas
                .Include(p => p.Transacoes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pessoa == null)
                return (false, "Pessoa não encontrada");

            // Remove todas as transações da pessoa
            _context.Transacoes.RemoveRange(pessoa.Transacoes);

            // Remove a pessoa
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return (true, "Pessoa deletada com sucesso");
        }
    }
}
