using GastosApi.Models;

public class TransacaoDto
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public DateTime DataTransacao { get; set; }

    public int PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;

    public int CategoriaId { get; set; }
    public string CategoriaDescricao { get; set; } = string.Empty;
}
