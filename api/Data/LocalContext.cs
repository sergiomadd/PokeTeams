using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using System;
using System.Drawing.Imaging;
using System.Text;

namespace api.Data
{
    public class LocalContext : DbContext
    {
        public LocalContext() : base()
        {

        }
        public LocalContext(DbContextOptions<LocalContext> option) : base(option)
        {

        }

        public SpriteDTO GetSprite(int dexNumber)
        {
            const string urlStart = "https://localhost:7134/images/sprites/pokemon/";
            string urlEnd = dexNumber + ".png";
            const string shiny = "shiny/";
            const string female = "female/";
            const string shinyFemale = "shiny/female/";
            const string key = "";

            return new SpriteDTO(key,
            urlStart + key + urlEnd,
            urlStart + key + shiny + urlEnd,
            urlStart + key + female + urlEnd,
            urlStart + key + shinyFemale + urlEnd);
        }

        public EditorDataDTO GetEditorData()
        {
            var json = File.ReadAllText("Data/Local/IconPaths.json");
            EditorDataDTO editorData = JsonConvert.DeserializeObject<EditorDataDTO>(json);
            //editorData.PokemonSpritesPaths = GetSprite(25);
            return editorData;
        }
    }
}
