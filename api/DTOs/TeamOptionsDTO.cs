namespace api.DTOs
{
    public class TeamOptionsDTO
    {
        public bool IVsVisibility { get; set; }
        public bool EVsVisibility { get; set; }
        public bool NaturesVisibility { get; set; }

        public TeamOptionsDTO() { }

        public TeamOptionsDTO(bool ivs = false, bool evs = false, bool natures = false) 
        {
            IVsVisibility = ivs;
            EVsVisibility = evs;
            NaturesVisibility = natures;
        }

        public void Logged()
        {
            IVsVisibility = true;
            EVsVisibility = true;
            NaturesVisibility = true;
        }
    }
}
