using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class TournamentDTO
    {
        public string Name { get; set; }
        public bool Official { get; set; }
        public string Regulation { get; set; }
        public DateTime Date { get; set; }
    }
}
