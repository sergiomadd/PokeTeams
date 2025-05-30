﻿using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public interface ITeamService
    {
        public Task<Team?> GetTeamModel(string id);
        public Task<TeamDTO?> GetTeam(string id, int langId);
        public Task<TeamDataDTO?> GetTeamData(string id, int langId);
        public Task<Team?> SaveTeam(TeamDTO team);
        public Task<Team?> UpdateTeam(TeamDTO inputTeam, string currentTeamID);
        public Task<bool> DeleteTeam(Team team);
        public Task<bool> DeleteTeamById(string teamId);
        public Task<bool> DeleteUserTeams(User user);
        public Task<string> IncrementTeamViewCount(string teamKey);
        public Task<TeamSearchQueryResponseDTO> QueryTeams(TeamSearchQueryDTO searchQuery, int langId);
        public string? ValidateTeamDTO(TeamDTO? inputTeam);
        public string? ValidateTeamSearchQueryDTO(TeamSearchQueryDTO? searchQuery);
    }
}
