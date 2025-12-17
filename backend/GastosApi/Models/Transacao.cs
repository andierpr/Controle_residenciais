using System;
using System.ComponentModel.DataAnnotations;

namespace GastosApi.Models
{
    public class Transacao
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Descricao { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        [Required]
        public DateTime DataTransacao { get; set; } = DateTime.UtcNow;

        // FK Pessoa
        public int PessoaId { get; set; }
        public Pessoa Pessoa { get; set; } = null!;

        // FK Categoria
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; } = null!;
    }
}
