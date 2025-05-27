using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class RegulationService : IRegulationService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly Printer Printer;

        public RegulationService(PokeTeamContext pokeTeamContext, Printer printer) 
        {
            _pokeTeamContext = pokeTeamContext;
            Printer = printer;
        }

        public RegulationDTO? BuildRegulationDTO(Regulation regulation)
        {
            RegulationDTO? regulationDTO = null;
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

        public Regulation? BreakRegulationDTO(RegulationDTO regulationDTO)
        {
            Regulation? regulation = null;
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

        public async Task<RegulationDTO?> GetRegulationByIdentifier(string identifier)
        {
            RegulationDTO? regulationDTO = null;
            if (identifier != null)
            {
                Regulation? regulation = await _pokeTeamContext.Regulation.FindAsync(identifier);
                if (regulation != null)
                {
                    regulationDTO = BuildRegulationDTO(regulation);
                }
            }
            return regulationDTO;
        }


        public async Task<List<RegulationDTO>> GetAllRegulations()
        {
            List<RegulationDTO> regulationDTOs = new List<RegulationDTO>();

            var query =
                from regulation in _pokeTeamContext.Regulation.Where(r => r.StartDate != null).OrderByDescending(r => r.StartDate)

                select new RegulationDTO
                {
                    Identifier = regulation.Identifier,
                    Name = regulation.Name,
                    StartDate = regulation.StartDate,
                    EndDate = regulation.EndDate
                };

            regulationDTOs = await query.ToListAsync();

            return regulationDTOs;
        }

        public async Task<Regulation?> SaveRegulation(RegulationDTO regulationDTO)
        {
            try
            {
                if (regulationDTO != null)
                {
                    Regulation? regulation = BreakRegulationDTO(regulationDTO);
                    if(regulation != null)
                    {
                        await _pokeTeamContext.Regulation.AddAsync(regulation);
                        await _pokeTeamContext.SaveChangesAsync();
                        return regulation;
                    }
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Error adding regulation");
                Printer.Log(ex.Message);
            }
            return null;
        }

        public async Task<List<QueryResultDTO>> QueryAllRegulations()
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from regulation in _pokeTeamContext.Regulation.Where(r => r.StartDate != null).OrderByDescending(r => r.StartDate)

                select new QueryResultDTO(regulation.Name, regulation.Identifier, null, "regulation");

            queryResults = await query.ToListAsync();

            return queryResults;
        }
    }
}
