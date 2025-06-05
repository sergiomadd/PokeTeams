using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class PokeTeamContext : IdentityDbContext<User, IdentityRole, string>, IPokeTeamContext
    {
        public PokeTeamContext() : base()
        {

        }

        public PokeTeamContext(DbContextOptions<PokeTeamContext> option) : base(option)
        {

        }

        public DbSet<Team> Team { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<TeamPokemon> TeamPokemon { get; set; }
        public DbSet<Tournament> Tournament { get; set; }
        public DbSet<Regulation> Regulation { get; set; }
        public DbSet<Country> Country { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
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
                .Property(t => t.TagIds)
                .HasColumnType("text[]");

            modelBuilder.Entity<Team>()
                .HasOne(t => t.User)
                .WithMany(p => p.Teams)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Teams)
                .WithOne(t => t.User)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>(
                u =>
                {
                    u.HasIndex(p => p.NormalizedEmail).HasDatabaseName("EmailIndex").IsUnique();
                    u.Property(p => p.UserName).HasMaxLength(32);
                    u.Property(p => p.NormalizedUserName).HasMaxLength(32);
                    u.Property(p => p.Email).HasMaxLength(256);
                    u.Property(p => p.NormalizedEmail).HasMaxLength(256);
                }
            );
        }

    }
}
