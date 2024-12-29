namespace api.DTOs
{
    public class UserPreviewDTO
    {
        public string? Username { get; set; }
        public string? Picture { get; set; }
        public bool Registered { get; set; }

        public UserPreviewDTO(string? username, string? picture = null, bool registered = false) 
        {
            Username = username;
            Picture = picture;
            Registered = registered;
        }
    }
}
