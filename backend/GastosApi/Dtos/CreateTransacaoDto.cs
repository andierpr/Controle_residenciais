using System.ComponentModel.DataAnnotations;
using GastosApi.Models;

namespace GastosApi.Dtos
{
    public class CreateTransacaoDto
    {
        [Required(ErrorMessage = "A descrição da transação é obrigatória.")]
        [MaxLength(200, ErrorMessage = "A descrição não pode ultrapassar 200 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "O valor da transação deve ser maior que 0.")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "O tipo de transação é obrigatório.")]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "O ID da pessoa é obrigatório.")]
        public int PessoaId { get; set; }

        [Required(ErrorMessage = "O ID da categoria é obrigatório.")]
        public int CategoriaId { get; set; }
    }
}
