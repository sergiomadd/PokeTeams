namespace api.Models.DTOs
{
    public class UserDTO
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public string? Picture { get; set; }
        public List<string> Teams { get; set; }
    }
}
