using api.Models.DBModels;
using api.Models.DBPokedexModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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

        public DbSet<Pokemon_species_names> Pokemon_species_names { get; set; }
        public DbSet<Pokemon_species> Pokemon_species { get; set; }
        public DbSet<Pokemon_types> Pokemon_types { get; set; }
        public DbSet<Pokemon_stats> Pokemon_stats { get; set; }
        public DbSet<Items> Items { get; set; }
        public DbSet<Item_names> Item_names { get; set; }
        public DbSet<Item_prose> Item_prose { get; set; }
        public DbSet<Abilities> Abilities { get; set; }
        public DbSet<Ability_names> Ability_names { get; set; }
        public DbSet<Ability_prose> Ability_prose { get; set; }
        public DbSet<Pokemon_abilities> Pokemon_abilities { get; set; }
        public DbSet<Natures> Natures { get; set; }
        public DbSet<Nature_names> Nature_names { get; set; }
        //
        public DbSet<Moves> Moves { get; set; }
        public DbSet<Move_names> Move_names { get; set; }
        public DbSet<Move_damage_class_prose> Move_damage_class_prose { get; set; }
        public DbSet<Move_target_prose> Move_target_prose { get; set; }
        public DbSet<Move_effect_prose> Move_effect_prose { get; set; }
        public DbSet<Move_meta> Move_meta { get; set; }
        public DbSet<Move_meta_stat_changes> Move_meta_stat_changes { get; set; }
        public DbSet<Pokemon_moves> Pokemon_moves { get; set; }

        //
        public DbSet<Types> Types { get; set; }
        public DbSet<Type_names> Type_names { get; set; }
        public DbSet<Type_efficacy> Type_efficacy { get; set; }
        public DbSet<Stats> Stats { get; set; }
        public DbSet<Stat_names> Stat_names { get; set; }

    }
}
