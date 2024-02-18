using api.Models.DBModels;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace api.Data
{
    public class PokeTeamContext : IdentityDbContext<User, IdentityRole, string>
    {
        public PokeTeamContext(DbContextOptions<PokeTeamContext> option) : base(option)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Team
            modelBuilder.Entity<Team>().ToTable("Teams");

            modelBuilder.Entity<Team>()
                .HasKey(t => t.Id);

            modelBuilder.Entity<Team>()
                .HasOne(t => t.Player)
                .WithMany(p => p.Teams)
                .HasForeignKey(t => t.PlayerId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Teams)
                .WithOne(t => t.Player)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>(
                u =>
                {
                    u.HasIndex(u => u.NormalizedEmail).HasName("EmailIndex").IsUnique();

                    u.Property(u => u.UserName).HasMaxLength(64);
                    u.Property(u => u.NormalizedUserName).HasMaxLength(64);
                    u.Property(u => u.Email).HasMaxLength(64);
                    u.Property(u => u.NormalizedEmail).HasMaxLength(64);

                    //custom
                    u.Property(u => u.Name).HasMaxLength(64);
                    u.Property(u => u.Country).HasMaxLength(64);
                }
            );
        }

        public DbSet<Team> Team { get; set; }
        public DbSet<User> User { get; set; }
    }
}
