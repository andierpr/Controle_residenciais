using GastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        // =====================
        // DbSets
        // =====================
        public DbSet<Pessoa> Pessoas { get; set; } = null!;
        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Categoria> Categorias { get; set; } = null!;
        public DbSet<Transacao> Transacoes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ---------------------
            // Pessoa
            // ---------------------
            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Nome)
                      .IsRequired()
                      .HasMaxLength(150);

                entity.HasMany(p => p.Transacoes)
                      .WithOne(t => t.Pessoa)
                      .HasForeignKey(t => t.PessoaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------------------
            // Usuario (Login)
            // ---------------------
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(150);

                entity.HasIndex(u => u.Email)
                      .IsUnique();

                entity.Property(u => u.SenhaHash)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.HasOne(u => u.Pessoa)
                      .WithOne(p => p.Usuario)
                      .HasForeignKey<Usuario>(u => u.PessoaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------------------
            // Categoria
            // ---------------------
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Descricao)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.HasMany(c => c.Transacoes)
                      .WithOne(t => t.Categoria)
                      .HasForeignKey(t => t.CategoriaId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ---------------------
            // Transacao
            // ---------------------
            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Descricao)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(t => t.Valor)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();

                entity.Property(t => t.DataTransacao)
                      .IsRequired();
            });
        }
    }
}
