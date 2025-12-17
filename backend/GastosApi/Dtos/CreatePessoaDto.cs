using System.ComponentModel.DataAnnotations;

namespace GastosApi.Dtos
{
    public class CreatePessoaDto
    {
        [Required, MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Range(0, 150)]
        public int Idade { get; set; }
    }
}
