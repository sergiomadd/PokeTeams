namespace api.Models.DTOs
{
    public class IdentityResponseDTO
    {
        public UserDTO User { get; set; }
        public bool Success { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}
