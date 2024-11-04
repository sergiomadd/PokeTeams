namespace api.DTOs
{
    public class TeamSearchQueryDTO
    {
        public List<TagDTO>? Queries { get; set; }
        public int? TeamsPerPage { get; set; }
        public int? SelectedPage { get; set; }
        public SortOrder? SortOrder { get; set; }
        public string? SetOperation { get; set; }
    }

    public class SortOrder
    {
        public SortType Type { get; set; }
        public SortWay Way { get; set; }

    }
    public enum SortType
    {
        Date,
        Views
    }
    public enum SortWay
    {
        Descending,
        Ascending
    }
}
