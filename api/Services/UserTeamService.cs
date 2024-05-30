using api.Data;
using api.Models.DBPoketeamModels;
using api.Util;

namespace api.Services
{
    public class UserTeamService : IUserTeamService
    {
        private readonly PokeTeamContext _pokeTeamContext;

        public UserTeamService(PokeTeamContext pokeTeamContext) 
        {
            _pokeTeamContext = pokeTeamContext;
        }

        public async Task<List<string>> GetUserTeamKeys(User user, bool logged)
        {
            List<string> teamKeys = new List<string>();
            List<Team> userTeams = new List<Team>();
            if (user == null) { Printer.Log(user.Name); return teamKeys; }
            try
            {
                //When logged user get all teams
                if (logged)
                {
                    userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id).ToList();
                }
                //When not logged get only public teams
                userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id && t.Visibility).ToList();
                //var test = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id && t.Visibility).Select(t => t.Id);

                foreach (Team team in userTeams)
                {
                    teamKeys.Add(team.Id);
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: GetUserTeamKeys(User user)");
                Printer.Log(ex);
            }
            return teamKeys;
        }
    }
}
