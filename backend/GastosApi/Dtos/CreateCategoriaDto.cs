using System.ComponentModel.DataAnnotations;
using GastosApi.Models;

namespace GastosApi.Dtos
{
    public class CreateCategoriaDto
    {
        [Required, MaxLength(100)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public FinalidadeCategoria Finalidade { get; set; }
    }
}
