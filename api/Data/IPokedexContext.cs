using api.Models.DBModels;
using api.Models.DBPokedexModels;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public interface IPokedexContext : IDisposable
    {
        public DbSet<pokemon_species_names> Pokemon_species_names { get; set; }
        public DbSet<pokemon_species> Pokemon_species { get; set; }
        public DbSet<pokemon_types> Pokemon_types { get; set; }
        public DbSet<pokemon_stats> Pokemon_stats { get; set; }
        public DbSet<items> Items { get; set; }
        public DbSet<item_names> Item_names { get; set; }
        public DbSet<item_prose> Item_prose { get; set; }
        public DbSet<abilities> Abilities { get; set; }
        public DbSet<ability_names> Ability_names { get; set; }
        public DbSet<ability_prose> Ability_prose { get; set; }
        public DbSet<pokemon_abilities> Pokemon_abilities { get; set; }
        public DbSet<natures> Natures { get; set; }
        public DbSet<nature_names> Nature_names { get; set; }
        //
        public DbSet<moves> Moves { get; set; }
        public DbSet<move_names> Move_names { get; set; }
        public DbSet<move_damage_class_prose> Move_damage_class_prose { get; set; }
        public DbSet<move_target_prose> Move_target_prose { get; set; }
        public DbSet<move_effect_prose> Move_effect_prose { get; set; }
        public DbSet<move_meta> Move_meta { get; set; }
        public DbSet<move_meta_stat_changes> Move_meta_stat_changes { get; set; }
        public DbSet<pokemon_moves> Pokemon_moves { get; set; }
        //
        public DbSet<types> Types { get; set; }
        public DbSet<type_names> Type_names { get; set; }
        public DbSet<type_efficacy> Type_efficacy { get; set; }
        public DbSet<stats> Stats { get; set; }
        public DbSet<stat_names> Stat_names { get; set; }
        //
        public DbSet<languages> Languages { get; set; }
    }
}
