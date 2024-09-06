using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;

namespace api.Services
{
    public class TournamentService : ITournamentService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IRegulationService _regulationService;


        public TournamentService(PokeTeamContext pokeTeamContext, IRegulationService regulationService) 
        {
            _pokeTeamContext = pokeTeamContext;
            _regulationService = regulationService;
        }

        public TournamentDTO BuildTournamentDTO(Tournament tournament)
        {
            TournamentDTO tournamentDTO = null;
            if (tournament != null)
            {
                tournamentDTO = new TournamentDTO
                {
                    Name = tournament.Name,
                    City = tournament.City,
                    CountryCode = tournament.CountryCode,
                    Official = tournament.Official,
                    Regulation = _regulationService.BuildRegulationDTO(tournament.Regulation),
                    Date = tournament.Date
                };
            }
            return tournamentDTO;
        }

        public Tournament BreakTournamentDTO(TournamentUploadDTO tournamentDTO)
        {
            Tournament tournament = null;
            if (tournamentDTO != null)
            {
                tournament = new Tournament
                {
                    Name = tournamentDTO.Name,
                    NormalizedName = tournamentDTO.Name.ToLower(),
                    City = tournamentDTO.City,
                    CountryCode = tournamentDTO.CountryCode,
                    Official = tournamentDTO.Official,
                    RegulationIdentifier = tournamentDTO.RegulationIdentifier,
                    Date = tournamentDTO.Date
                };
            }
            return tournament;
        }

        public List<TournamentDTO> GetAllTournaments()
        {
            List<TournamentDTO> tournamentDTOs = new List<TournamentDTO>();
            List<Tournament> tournaments = _pokeTeamContext.Tournament.ToList();
            foreach (Tournament tournament in tournaments)
            {
                tournamentDTOs.Add(BuildTournamentDTO(tournament));
            }
            return tournamentDTOs;
        }

        public async Task<TournamentDTO> GetTournamentByName(string name)
        {
            TournamentDTO tournamentDTO = null;
            if (name != null)
            {
                Tournament tournament = await _pokeTeamContext.Tournament.FindAsync(name.ToLower());
                if (tournament != null)
                {
                    tournamentDTO = BuildTournamentDTO(tournament);
                }
            }
            return tournamentDTO;
        }

        public async Task<Tournament> SaveTournament(TournamentUploadDTO tournamentDTO)
        {
            try
            {
                if (tournamentDTO != null)
                {
                    Tournament tournament = BreakTournamentDTO(tournamentDTO);
                    await _pokeTeamContext.Tournament.AddAsync(tournament);
                    await _pokeTeamContext.SaveChangesAsync();
                    return tournament;
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Error adding tournament");
                Printer.Log(ex.Message);
            }
            return null;
        }

        public List<TagDTO> QueryTournamentsByName(string key)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Tournament> tournaments = _pokeTeamContext.Tournament.Where(t => t.NormalizedName.Contains(key.ToLower())).ToList();
            if (tournaments != null && tournaments.Count > 0)
            {
                tournaments.ForEach(tournament =>
                {
                    string path = "https://localhost:7134/images/misc/vgc.png";
                    queryResults.Add(new TagDTO(tournament.Name, tournament.Name, type: "tournament",
                        icon: tournament.Official ? path : null));
                });
            }
            return queryResults;
        }
    }
}
