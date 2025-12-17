namespace GastosApi.Dtos
{
    public class PessoaTotaisDto
    {
        public int PessoaId { get; set; }
        public string PessoaNome { get; set; } = string.Empty;

        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}
