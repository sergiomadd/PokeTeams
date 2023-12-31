using api.Models.DBModels;
using api.Models.DBPoketeamModels;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class PoketeamContext : DbContext
    {
        public PoketeamContext(DbContextOptions<PoketeamContext> option) : base(option)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        public DbSet<Team> Team { get; set; }
        public DbSet<TeamPokemon> TeamPokemon { get; set; }
    }
}
