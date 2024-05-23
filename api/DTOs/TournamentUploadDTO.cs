namespace api.DTOs
{
    public class TournamentUploadDTO
    {
        public string Name { get; set; }
        public string? City { get; set; }
        public string? CountryCode { get; set; }
        public bool Official { get; set; }
        public string? RegulationIdentifier { get; set; }
        public DateOnly? Date { get; set; }
    }
}
