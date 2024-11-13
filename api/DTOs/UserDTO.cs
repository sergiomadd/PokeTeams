namespace api.DTOs
{
    public class UserDTO
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public string? Picture { get; set; }
        public CountryDTO? Country { get; set; }
        public bool Visibility { get; set; }
        //Logged
        public string? Email { get; set; }
        public bool? EmailConfirmed { get; set; }
    }
}
