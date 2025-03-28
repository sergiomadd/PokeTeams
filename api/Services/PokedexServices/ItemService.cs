using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Models.DBModels;
using api.Util;
using MethodTimer;
using Microsoft.EntityFrameworkCore;


namespace api.Services.PokedexServices
{
    public class ItemService : IItemService
    {
        private readonly IPokedexContext _pokedexContext;

        public ItemService(IPokedexContext pokedexContext)
        {
            _pokedexContext = pokedexContext;
        }

        public async Task<ItemDTO?> GetItemByIdentifier(string identifier, int langId)
        {
            ItemDTO? item = null;

            var query =
                from items in _pokedexContext.Items.Where(i => i.identifier == identifier)

                join itemNames in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemNames.item_id, Key2 = itemNames.local_language_id } into itemNamesJoin
                from itemNames in itemNamesJoin.DefaultIfEmpty()

                join itemNamesDefault in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemNamesDefault.item_id, Key2 = itemNamesDefault.local_language_id } into itemNamesDefaultJoin
                from itemNamesDefault in itemNamesDefaultJoin.DefaultIfEmpty()

                join itemProses in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemProses.item_id, Key2 = itemProses.local_language_id } into itemProsesJoin
                from itemProses in itemProsesJoin.DefaultIfEmpty()

                join itemProsesDefault in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemProsesDefault.item_id, Key2 = itemProsesDefault.local_language_id } into itemProsesDefaultJoin
                from itemProsesDefault in itemProsesDefaultJoin.DefaultIfEmpty()

                select new ItemDTO(
                    items.identifier,

                    new LocalizedText(itemNames != null ? itemNames.name : itemNamesDefault.name,
                        itemNames != null ? itemNames.local_language_id : itemNamesDefault.local_language_id),

                    new LocalizedText(Formatter.FormatProse(itemProses != null ? itemProses.effect : itemProsesDefault.effect, null),
                        itemProses != null ? itemProses.local_language_id : itemProsesDefault.local_language_id));

            item = await query.FirstOrDefaultAsync();

            return item;
        }

        public async Task<ItemDTO?> GetItemByName(string name, int langId)
        {
            ItemDTO? item = null;

            var query =

                from itemNamesInput in _pokedexContext.Item_names.Where(i => i.name == name)

                join items in _pokedexContext.Items
                on new { Key1 = itemNamesInput.item_id } equals new { Key1 = items.id } into itemsJoin
                from items in itemsJoin.DefaultIfEmpty()

                join itemNames in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemNames.item_id, Key2 = itemNames.local_language_id } into itemNamesJoin
                from itemNames in itemNamesJoin.DefaultIfEmpty()

                join itemNamesDefault in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemNamesDefault.item_id, Key2 = itemNamesDefault.local_language_id } into itemNamesDefaultJoin
                from itemNamesDefault in itemNamesDefaultJoin.DefaultIfEmpty()

                join itemProses in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemProses.item_id, Key2 = itemProses.local_language_id } into itemProsesJoin
                from itemProses in itemProsesJoin.DefaultIfEmpty()

                join itemProsesDefault in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemProsesDefault.item_id, Key2 = itemProsesDefault.local_language_id } into itemProsesDefaultJoin
                from itemProsesDefault in itemProsesDefaultJoin.DefaultIfEmpty()

                select new ItemDTO(
                    items.identifier,

                    itemNames != null || itemProsesDefault != null ?
                        new LocalizedText(itemNames != null && itemNames.local_language_id == langId ? itemNames.name : itemNamesDefault.name,
                        itemNames != null && itemNames.local_language_id == langId ? itemNames.local_language_id : itemNamesDefault.local_language_id) : null,

                    itemProses != null || itemProsesDefault != null ?
                        new LocalizedText(Formatter.FormatProse(itemProses != null && itemProses.local_language_id == langId ? itemProses.effect : itemProsesDefault.effect, null),
                        itemProses != null && itemProses.local_language_id == langId ? itemProses.local_language_id : itemProsesDefault.local_language_id) : null);

            item = query != null ? await query.FirstOrDefaultAsync() : null;

            return item;
        }

        public async Task<List<QueryResultDTO>> QueryItemsByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            string pathStart = "https://localhost:7134/images/sprites/items/";

            var query =
                from itemNames in _pokedexContext.Item_names.Where(i => i.name.StartsWith(key) && i.local_language_id == langId)

                join items in _pokedexContext.Items
                on new { Key1 = itemNames.item_id } equals new { Key1 = items.id } into itemsJoin
                from items in itemsJoin.DefaultIfEmpty()

                select new QueryResultDTO(itemNames.name, items.identifier, $"{pathStart}{items.identifier}.png", "item");

            queryResults = await query.ToListAsync();

            return queryResults;
        }
    }
}
