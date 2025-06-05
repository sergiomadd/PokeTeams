namespace api.DTOs
{
    public class UserPreviewDTO
    {
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Picture { get; set; }
        public bool Registered { get; set; }

        public UserPreviewDTO(string? username, string? name = null, string? picture = null, bool registered = false) 
        {
            Username = username;
            Name = name;
            Picture = picture;
            Registered = registered;
        }
    }
}
