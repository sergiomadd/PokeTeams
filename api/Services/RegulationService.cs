using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;

namespace api.Services
{
    public class RegulationService : IRegulationService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        public RegulationService(PokeTeamContext pokeTeamContext) 
        {
            _pokeTeamContext = pokeTeamContext;
        }

        public RegulationDTO BuildRegulationDTO(Regulation regulation)
        {
            RegulationDTO regulationDTO = null;
            if (regulation != null)
            {
                regulationDTO = new RegulationDTO
                {
                    Identifier = regulation.Identifier,
                    Name = regulation.Name,
                    StartDate = regulation.StartDate,
                    EndDate = regulation.EndDate
                };
            }
            return regulationDTO;
        }

        public Regulation BreakRegulationDTO(RegulationDTO regulationDTO)
        {
            Regulation regulation = null;
            if (regulationDTO != null)
            {
                regulation = new Regulation
                {
                    Identifier = regulationDTO.Identifier,
                    Name = regulationDTO.Name,
                    StartDate = regulationDTO.StartDate,
                    EndDate = regulationDTO.EndDate
                };
            }
            return regulation;
        }

        public List<RegulationDTO> GetAllRegulations()
        {
            List<RegulationDTO> regulationDTOs = new List<RegulationDTO>();
            List<Regulation> regulations = _pokeTeamContext.Regulation.ToList();
            foreach (Regulation regulation in regulations)
            {
                regulationDTOs.Add(BuildRegulationDTO(regulation));
            }
            return regulationDTOs;
        }

        public async Task<RegulationDTO> GetRegulationByIdentifier(string identifier)
        {
            RegulationDTO regulationDTO = null;
            if (identifier != null)
            {
                Regulation regulation = await _pokeTeamContext.Regulation.FindAsync(identifier);
                if (regulation != null)
                {
                    regulationDTO = BuildRegulationDTO(regulation);
                }
            }
            return regulationDTO;
        }

        public async Task<Regulation> SaveRegulation(RegulationDTO regulationDTO)
        {
            try
            {
                if (regulationDTO != null)
                {
                    Regulation regulation = BreakRegulationDTO(regulationDTO);
                    await _pokeTeamContext.Regulation.AddAsync(regulation);
                    await _pokeTeamContext.SaveChangesAsync();
                    return regulation;
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Error adding regulation");
                Printer.Log(ex.Message);
            }
            return null;
        }

    }
}
