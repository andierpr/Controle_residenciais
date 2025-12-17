using GastosApi.Dtos;
using GastosApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly CategoriaService _service;
        public CategoriasController(CategoriaService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await _service.ListarAsync());

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateCategoriaDto dto)
        {
            var (sucesso, mensagem, categoria) = await _service.CriarAsync(dto);
            return sucesso ? Ok(new { sucesso, mensagem, categoria }) : BadRequest(new { sucesso, mensagem });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CreateCategoriaDto dto)
        {
            var (sucesso, mensagem, categoria) = await _service.AtualizarAsync(id, dto);
            return sucesso ? Ok(new { sucesso, mensagem, categoria }) : NotFound(new { sucesso, mensagem });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (sucesso, mensagem) = await _service.ExcluirAsync(id);
            return sucesso ? Ok(new { sucesso, mensagem }) : NotFound(new { sucesso, mensagem });
        }
    }
}
