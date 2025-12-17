using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GastosApi.Models
{
    public class Pessoa
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Range(0, 150)]
        public int Idade { get; set; }

        // ---------------------
        // Relacionamentos
        // ---------------------

        // 1:N → Pessoa → Transacoes
        // Evita loop JSON
        [JsonIgnore]
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        // 1:1 → Pessoa → Usuario
        // Evita loop JSON
        [JsonIgnore]
        public Usuario Usuario { get; set; } = null!;
    }
}
