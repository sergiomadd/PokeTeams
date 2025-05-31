using api.Models.DBModels;
using api.Models.DBPokedexModels;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class PokedexContext : DbContext, IPokedexContext
    {
        public PokedexContext() : base()
        {

        }

        public PokedexContext(DbContextOptions<PokedexContext> option) : base(option)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.LogTo(Printer.Log);
            //optionsBuilder.EnableSensitiveDataLogging();
        }

        public DbSet<abilities> abilities { get; set; }
        public DbSet<ability_names> ability_names { get; set; }
        public DbSet<ability_prose> ability_prose { get; set; }

        public DbSet<item_names> item_names { get; set; }
        public DbSet<item_prose> item_prose { get; set; }
        public DbSet<items> items { get; set; }

        public DbSet<move_damage_class_prose> move_damage_class_prose { get; set; }
        public DbSet<move_effect_prose> move_effect_prose { get; set; }
        public DbSet<move_meta> move_meta { get; set; }
        public DbSet<move_meta_stat_changes> move_meta_stat_changes { get; set; }
        public DbSet<move_names> move_names { get; set; }
        public DbSet<move_target_prose> move_target_prose { get; set; }
        public DbSet<moves> moves { get; set; }

        public DbSet<nature_names> nature_names { get; set; }
        public DbSet<natures> natures { get; set; }

        public DbSet<pokemon> pokemon { get; set; }
        public DbSet<pokemon_abilities> pokemon_abilities { get; set; }
        public DbSet<pokemon_moves> pokemon_moves { get; set; }
        public DbSet<pokemon_species> pokemon_species { get; set; }
        public DbSet<pokemon_species_names> pokemon_species_names { get; set; }
        public DbSet<pokemon_stats> pokemon_stats { get; set; }
        public DbSet<pokemon_types> pokemon_types { get; set; }
        public DbSet<pokemon_forms> pokemon_forms { get; set; }
        public DbSet<pokemon_form_names> pokemon_form_names { get; set; }
        public DbSet<pokemon_form_types> pokemon_form_types { get; set; }


        public DbSet<stat_names> stat_names { get; set; }
        public DbSet<stats> stats { get; set; }

        public DbSet<type_efficacy> type_efficacy { get; set; }
        public DbSet<type_names> type_names { get; set; }
        public DbSet<types> types { get; set; }

        public DbSet<languages> languages { get; set; }
    }
}
