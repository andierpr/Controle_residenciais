using GastosApi.Data;
using GastosApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GastosApi.Controllers
{
   
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RelatoriosController(AppDbContext context) => _context = context;

        [HttpGet("pessoas-totais")]
        public async Task<IActionResult> TotaisPorPessoa()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

            var resultado = pessoas.Select(p => new
            {
                p.Id,
                p.Nome,
                TotalReceitas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => (decimal?)t.Valor) ?? 0m,
                TotalDespesas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => (decimal?)t.Valor) ?? 0m
            }).Select(p => new
            {
                p.Id,
                p.Nome,
                p.TotalReceitas,
                p.TotalDespesas,
                Saldo = p.TotalReceitas - p.TotalDespesas
            }).ToList();

            var totalGeralReceitas = resultado.Sum(x => x.TotalReceitas);
            var totalGeralDespesas = resultado.Sum(x => x.TotalDespesas);
            var saldoGeral = totalGeralReceitas - totalGeralDespesas;

            return Ok(new
            {
                PorPessoa = resultado,
                TotaisGeral = new { totalGeralReceitas, totalGeralDespesas, saldoGeral }
            });
        }

        [HttpGet("categorias-totais")]
        public async Task<IActionResult> TotaisPorCategoria()
        {
            var categorias = await _context.Categorias
                .Include(c => c.Transacoes)
                .ToListAsync();

            var resultado = categorias.Select(c => new
            {
                c.Id,
                c.Descricao,
                TotalReceitas = c.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => (decimal?)t.Valor) ?? 0m,
                TotalDespesas = c.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => (decimal?)t.Valor) ?? 0m
            }).Select(c => new
            {
                c.Id,
                c.Descricao,
                c.TotalReceitas,
                c.TotalDespesas,
                Saldo = c.TotalReceitas - c.TotalDespesas
            }).ToList();

            var totalGeralReceitas = resultado.Sum(x => x.TotalReceitas);
            var totalGeralDespesas = resultado.Sum(x => x.TotalDespesas);
            var saldoGeral = totalGeralReceitas - totalGeralDespesas;

            return Ok(new
            {
                PorCategoria = resultado,
                TotaisGeral = new { totalGeralReceitas, totalGeralDespesas, saldoGeral }
            });
        }
    }
}
