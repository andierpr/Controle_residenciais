using GastosApi.Dtos;
using GastosApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GastosApi.Controllers
{
    //[Authorize] // Descomente se desejar autenticação
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoService _service;

        public TransacoesController(TransacaoService service)
        {
            _service = service;
        }

        // GET: api/transacoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransacaoDto>>> GetAll()
        {
            var transacoes = await _service.ListarAsync();
            return Ok(transacoes);
        }

        // GET: api/transacoes/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TransacaoDto>> GetById(int id)
        {
            var transacao = await _service.ObterPorIdAsync(id);
            if (transacao == null)
                return NotFound(new { message = "Transação não encontrada." });

            return Ok(transacao);
        }

        // POST: api/transacoes
        [HttpPost]
        public async Task<ActionResult<TransacaoDto>> Create([FromBody] CreateTransacaoDto dto)
        {
            var transacao = await _service.CriarAsync(dto);
            if (transacao == null)
                return BadRequest(new { message = "Pessoa menor de idade ou Categoria inválida." });

            return CreatedAtAction(nameof(GetById), new { id = transacao.Id }, transacao);
        }

        // PUT: api/transacoes/5
        [HttpPut("{id:int}")]
        public async Task<ActionResult<TransacaoDto>> Update(int id, [FromBody] CreateTransacaoDto dto)
        {
            var transacaoAtualizada = await _service.AtualizarAsync(id, dto);
            if (transacaoAtualizada == null)
                return NotFound(new { message = "Transação, Pessoa ou Categoria não encontrada." });

            return Ok(transacaoAtualizada);
        }

        // DELETE: api/transacoes/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sucesso = await _service.DeletarAsync(id);
            if (!sucesso)
                return NotFound(new { message = "Transação não encontrada." });

            return NoContent();
        }

        // NOVO ENDPOINT: Totais por Pessoa
        // GET: api/transacoes/totais-por-pessoa
        [HttpGet("totais-por-pessoa")]
        public async Task<ActionResult<IEnumerable<PessoaTotaisDto>>> TotaisPorPessoa()
        {
            var totais = await _service.TotaisPorPessoaAsync();
            return Ok(totais);
        }

        // NOVO ENDPOINT: Totais por Categoria
        // GET: api/transacoes/totais-por-categoria
        [HttpGet("totais-por-categoria")]
        public async Task<ActionResult<IEnumerable<CategoriaTotaisDto>>> TotaisPorCategoria()
        {
            var totais = await _service.TotaisPorCategoriaAsync();
            return Ok(totais);
        }
    }
}
