using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class DexNumberToPokemonId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DexNumber",
                table: "Pokemon");

            migrationBuilder.AddColumn<int>(
                name: "PokemonId",
                table: "Pokemon",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PokemonId",
                table: "Pokemon");

            migrationBuilder.AddColumn<int>(
                name: "DexNumber",
                table: "Pokemon",
                type: "integer",
                nullable: true);
        }
    }
}
