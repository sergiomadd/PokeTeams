using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class removeTypesFromPokemon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type1Identifier",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "Type2Identifier",
                table: "Pokemon");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type1Identifier",
                table: "Pokemon",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type2Identifier",
                table: "Pokemon",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);
        }
    }
}
