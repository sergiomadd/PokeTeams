namespace api.DTOs
{
    public class RegulationDTO
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
    }
}
