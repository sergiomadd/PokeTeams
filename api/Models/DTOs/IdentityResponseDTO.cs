namespace api.Models.DTOs
{
    public class IdentityResponseDTO
    {
        public bool Success { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}
