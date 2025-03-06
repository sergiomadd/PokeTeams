using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRegulationFromTournament : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tournament_Regulation_RegulationIdentifier",
                table: "Tournament");

            migrationBuilder.DropIndex(
                name: "IX_Tournament_RegulationIdentifier",
                table: "Tournament");

            migrationBuilder.DropColumn(
                name: "RegulationIdentifier",
                table: "Tournament");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RegulationIdentifier",
                table: "Tournament",
                type: "nvarchar(2)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tournament_RegulationIdentifier",
                table: "Tournament",
                column: "RegulationIdentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_Tournament_Regulation_RegulationIdentifier",
                table: "Tournament",
                column: "RegulationIdentifier",
                principalTable: "Regulation",
                principalColumn: "Identifier");
        }
    }
}
