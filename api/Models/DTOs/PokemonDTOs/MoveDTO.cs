namespace api.Models.DTOs.PokemonDTOs
{
    public class MoveDTO
    {
        public string? Name { get; set; }
        public PokeTypeDTO? PokeType { get; set; }
        public MoveDamageClass? DamageClass { get; set; }
        public int? Power { get; set; }
        public int? Pp { get; set; }
        public int? Accuracy { get; set; }
        public int? Priority { get; set; }
        public MoveTarget? Target { get; set; }
        public MoveEffect? Effect { get; set; }
        public Metadata? Meta { get; set; }

        public class MoveDamageClass
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string IconPath { get; set; }
        }

        public class MoveTarget
        {
            public string Name { get; set; }
            public string Description { get; set; }
        }

        public class MoveEffect
        {
            public string Short { get; set; }
            public string Long { get; set; }
            public int? Chance { get; set; }
        }

        public class Metadata
        {
            public int? MinHits { get; set; }
            public int? MaxHits { get; set; }
            public int? MinTurns { get; set; }
            public int? MaxTurns { get; set; }
            public int? Drain { get; set; }
            public int? Healing { get; set; }
            public int? CritRate { get; set; }
            public int? StatusChance { get; set; }
            public int? FlinchChance { get; set; }
            public StatChange? StatChange { get; set; }
        }


        public class StatChange
        {
            public StatDTO? Stat { get; set; }
            public int? Change { get; set; }
            public int? ChangeChance { get; set; }

        }


    }
}
