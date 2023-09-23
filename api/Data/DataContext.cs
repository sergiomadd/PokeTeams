using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> option) : base(option)
        {

        }

        public DbSet<Pokemon> Pokemon { get; set; }
        public DbSet<Item_names> Item_names { get; set; }
        public DbSet<Item_prose> Item_prose { get; set; }
        public DbSet<Ability_names> Ability_names { get; set; }
        public DbSet<Ability_prose> Ability_prose { get; set; }
    }
}
