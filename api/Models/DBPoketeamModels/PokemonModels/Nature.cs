using api.Models.DTOs.PokemonDTOs;

namespace api.Models.DBPoketeamModels.Pokemon
{
    public class Nature
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public StatDTO IncreasedStat { get; set; }
        public StatDTO DecreasedStat { get; set; }

        public Nature(string name, string identifier, StatDTO increasedStat, StatDTO decreasedStat)
        {
            Name = name;
            Identifier = identifier;
            IncreasedStat = increasedStat;
            DecreasedStat = decreasedStat;
        }
    }
}
