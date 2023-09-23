using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> option) : base(option)
        {

        }

        public DbSet<Pokemon_species_names> Pokemon_species_names { get; set; }
        public DbSet<Pokemon_stats> Pokemon_stats { get; set; }
        public DbSet<Item_names> Item_names { get; set; }
        public DbSet<Item_prose> Item_prose { get; set; }
        public DbSet<Ability_names> Ability_names { get; set; }
        public DbSet<Ability_prose> Ability_prose { get; set; }
        public DbSet<Natures> Natures { get; set; }
        public DbSet<Nature_names> Nature_names { get; set; }

        public DbSet<Stat_names> Stat_names { get; set; }

    }
}
