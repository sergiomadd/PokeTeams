using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.EntityFrameworkCore;
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

        public List<SpriteDTO> GetSprites(int dexNumber)
        {
            const string urlStart = "https://localhost:7134/images/sprites/pokemon/";
            string urlEnd = dexNumber + ".png";
            string urlEndGif = dexNumber + ".gif";
            const string shiny = "shiny/";
            const string female = "female/";
            const string shinyFemale = "shiny/female/";

            List<SpriteDTO> sprites = new List<SpriteDTO>();
            List<string> spriteKeys = new List<string>
            {
                 "",
                 "other/showdown/",
                 "other/home/",
                 "other/official-artwork/",
                 "versions/generation-viii/icons/",
                 "versions/generation-vii/ultra-sun-ultra-moon/",
                 "versions/generation-vi/omegaruby-alphasapphire/","versions/generation-vi/x-y/",
                 "versions/generation-v/black-white/", "versions/generation-v/black-white/animated/",
                 "versions/generation-iv/platinum/", "versions/generation-iv/heartgold-soulsilver/", "versions/generation-iv/diamond-pearl/",
                 "versions/generation-iii/emerald/", "versions/generation-iii/firered-leafgreen/", "versions/generation-iii/ruby-sapphire/",
                 "versions/generation-ii/crystal/",  "versions/generation-ii/silver/", "versions/generation-ii/gold/",
                 "versions/generation-i/yellow/", "versions/generation-i/red-blue/"
            };
            List<string> animatedSpriteKeys = new List<string> { "versions/generation-v/black-white/animated/", "other/showdown/" };
            foreach (string key in spriteKeys)
            {
                if (animatedSpriteKeys.Contains(key))
                {
                    sprites.Add(new SpriteDTO(key,
                        urlStart + key + urlEndGif,
                        urlStart + key + shiny + urlEndGif,
                        urlStart + key + female + urlEndGif,
                        urlStart + key + shinyFemale + urlEndGif));
                }
                else
                {
                    sprites.Add(new SpriteDTO(key,
                        urlStart + key + urlEnd,
                        urlStart + key + shiny + urlEnd,
                        urlStart + key + female + urlEnd,
                        urlStart + key + shinyFemale + urlEnd));
                }
            }
            return sprites;
        }

        public EditorDataDTO GetEditorData()
        {
            var json = File.ReadAllText("Data/Local/IconPaths.json");
            EditorDataDTO editorData = JsonConvert.DeserializeObject<EditorDataDTO>(json);
            editorData.PokemonSpritesPaths = GetSprites(25);
            return editorData;
        }
    }
}
