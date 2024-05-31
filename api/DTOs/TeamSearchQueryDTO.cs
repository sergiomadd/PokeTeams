namespace api.DTOs
{
    public class TeamSearchQueryDTO
    {
        public string? UserName { get; set; }
        public string? TournamentName { get; set; }
        public string? Regulation { get; set; }
        public List<string>? Pokemons { get; set; }
        public List<string>? Moves { get; set; }
        public List<string>? Items { get; set; }
        public int? TeamsPerPage { get; set; }
        public int? SelectedPage { get; set; }
        public TeamSearchOrder? Order { get; set; }
    }

    public enum TeamSearchOrder
    {
        DateAscending,
        DateDescending,
        ViewsAscending,
        ViewsDescending
    }
}
