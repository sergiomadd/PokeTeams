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
        public DbSet<Team> Team { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<TeamTag> TeamTag { get; set; }
        public DbSet<Pokemon> Pokemon { get; set; }
        public DbSet<Tournament> Tournament { get; set; }
        public DbSet<Regulation> Regulation { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Regulation>()
                .HasMany(r => r.Tournaments)
                .WithOne(t => t.Regulation)
                .HasForeignKey(t => t.RegulationIdentifier)
                .IsRequired(false);
            
            modelBuilder.Entity<Tournament>()
                .HasMany(t => t.Teams)
                .WithOne(t => t.Tournament)
                .HasForeignKey(t => t.TournamentNormalizedName)
                .IsRequired(false);

            modelBuilder.Entity<Team>()
                .HasMany(t => t.Pokemons)
                .WithOne(p => p.Team)
                .HasForeignKey(p => p.TeamId);

            modelBuilder.Entity<Team>()
                .HasMany(t => t.Tags)
                .WithMany(ta => ta.Teams)
                .UsingEntity<TeamTag>();

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
                    u.HasIndex(p => p.NormalizedEmail).HasName("EmailIndex").IsUnique();

                    u.Property(p => p.UserName).HasMaxLength(32);
                    u.Property(p => p.NormalizedUserName).HasMaxLength(32);
                    u.Property(p => p.Email).HasMaxLength(256);
                    u.Property(p => p.NormalizedEmail).HasMaxLength(256);
                }
            );
        }

    }
}
