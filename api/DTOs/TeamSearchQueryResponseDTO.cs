namespace api.DTOs
{
    public class TeamSearchQueryResponseDTO
    {
        public List<TeamPreviewDTO?> Teams { get; set; }
        public int TotalTeams { get; set; }
    }
}
