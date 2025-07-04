namespace api.DTOs
{
    public class NewExternalAuthDTO
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string SuggestedUsername { get; set; }
        public string IdToken { get; set; }
        public bool RequiredUsername { get; set; }
    }
}
