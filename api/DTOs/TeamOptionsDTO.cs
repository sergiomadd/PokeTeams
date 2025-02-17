namespace api.DTOs
{
    public class TeamOptionsDTO
    {
        public bool IvsVisibility { get; set; }
        public bool EvsVisibility { get; set; }
        public bool NaturesVisibility { get; set; }

        public TeamOptionsDTO() { }

        public TeamOptionsDTO(bool ivs = false, bool evs = false, bool natures = false) 
        {
            IvsVisibility = ivs;
            EvsVisibility = evs;
            NaturesVisibility = natures;
        }

        public void Logged()
        {
            IvsVisibility = true;
            EvsVisibility = true;
            NaturesVisibility = true;
        }
    }
}
