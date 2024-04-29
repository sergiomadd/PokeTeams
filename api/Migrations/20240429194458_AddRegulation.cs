using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddRegulation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RegulationIdentifier",
                table: "Tournament",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Regulation",
                columns: table => new
                {
                    Identifier = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regulation", x => x.Identifier);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tournament_Regulation_RegulationIdentifier",
                table: "Tournament");

            migrationBuilder.DropTable(
                name: "Regulation");

            migrationBuilder.DropIndex(
                name: "IX_Tournament_RegulationIdentifier",
                table: "Tournament");

            migrationBuilder.AlterColumn<string>(
                name: "RegulationIdentifier",
                table: "Tournament",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
