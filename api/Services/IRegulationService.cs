using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface IRegulationService
    {
        public RegulationDTO BuildRegulationDTO(Regulation regulation);
        public Regulation BreakRegulationDTO(RegulationDTO regulationDTO);
        public Task<RegulationDTO> GetRegulationByIdentifier(string identifier);
        public Task<List<RegulationDTO>> GetAllRegulations();
        public Task<Regulation> SaveRegulation(RegulationDTO regulationDTO);
        public Task<List<QueryResultDTO>> QueryAllRegulations();
    }
}
