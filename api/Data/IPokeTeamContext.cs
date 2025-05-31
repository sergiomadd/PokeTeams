using api.Models.DBPoketeamModels;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public interface IPokeTeamContext : IDisposable
    {
        public DbSet<Team> Team { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<TeamPokemon> TeamPokemon { get; set; }
        public DbSet<Tournament> Tournament { get; set; }
        public DbSet<Regulation> Regulation { get; set; }
        public DbSet<Country> Country { get; set; }
    }
}
