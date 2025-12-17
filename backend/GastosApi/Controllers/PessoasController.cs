using GastosApi.Dtos;
using GastosApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly PessoaService _service;

        public PessoasController(PessoaService service) => _service = service;

        // GET: api/pessoas
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var pessoas = await _service.ListarAsync();
            return Ok(pessoas);
        }

        // POST: api/pessoas
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreatePessoaDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { sucesso = false, mensagem = "Dados inválidos." });

            var (sucesso, mensagem, pessoa) = await _service.CriarAsync(dto);
            return sucesso
                ? Ok(new { sucesso, mensagem, pessoa })
                : BadRequest(new { sucesso, mensagem });
        }

        // DELETE: api/pessoas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (sucesso, mensagem) = await _service.DeletarAsync(id);
            return sucesso
                ? Ok(new { sucesso, mensagem })
                : NotFound(new { sucesso, mensagem });
        }

        // PUT: api/pessoas/{id} - caso queira edição futura
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CreatePessoaDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { sucesso = false, mensagem = "Dados inválidos." });

            var (sucesso, mensagem, pessoa) = await _service.AtualizarAsync(id, dto);
            return sucesso
                ? Ok(new { sucesso, mensagem, pessoa })
                : NotFound(new { sucesso, mensagem });
        }
    }
}
