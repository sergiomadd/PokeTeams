namespace api.DTOs
{
    public class TeamSearchQueryDTO
    {
        public List<TagDTO>? Queries { get; set; }
        public int? TeamsPerPage { get; set; }
        public int? SelectedPage { get; set; }
        public TeamSearchOrder? Order { get; set; }
        public string? SetOperation { get; set; }
    }

    public enum TeamSearchOrder
    {
        DateAscending,
        DateDescending,
        ViewsAscending,
        ViewsDescending
    }
}
