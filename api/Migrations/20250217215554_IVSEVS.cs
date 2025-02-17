using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class IVSEVS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "evs",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "ivs",
                table: "Pokemon");

            migrationBuilder.AddColumn<int>(
                name: "EV_atk",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EV_def",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EV_hp",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EV_spa",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EV_spd",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EV_spe",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IV_atk",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IV_def",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IV_hp",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IV_spa",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IV_spd",
                table: "Pokemon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IV_spe",
                table: "Pokemon",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EV_atk",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "EV_def",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "EV_hp",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "EV_spa",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "EV_spd",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "EV_spe",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "IV_atk",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "IV_def",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "IV_hp",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "IV_spa",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "IV_spd",
                table: "Pokemon");

            migrationBuilder.DropColumn(
                name: "IV_spe",
                table: "Pokemon");

            migrationBuilder.AddColumn<string>(
                name: "evs",
                table: "Pokemon",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ivs",
                table: "Pokemon",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: true);
        }
    }
}
