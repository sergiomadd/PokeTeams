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
        public DbSet<Teams> Teams { get; set; }
    }
}
