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
            //Team
            modelBuilder.Entity<Team>().ToTable("Teams");

            modelBuilder.Entity<Team>()
                .HasKey(t => t.Id);

            modelBuilder.Entity<Team>()
                .HasOne(t => t.Player)
                .WithMany(p => p.Teams)
                .HasForeignKey(t => t.PlayerId);


                
        }

        public DbSet<Team> Team { get; set; }
        public DbSet<TeamPokemon> TeamPokemon { get; set; }
        public DbSet<UserTeam> UserTeam { get; set; }
        public DbSet<User> User { get; set; }
    }
}
