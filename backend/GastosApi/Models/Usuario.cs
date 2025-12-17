using System.ComponentModel.DataAnnotations;

namespace GastosApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string SenhaHash { get; set; } = string.Empty;

        public int PessoaId { get; set; }
        public Pessoa Pessoa { get; set; } = null!;
    }
}
