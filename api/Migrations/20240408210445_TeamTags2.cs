using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class TeamTags2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tag_Teams_TeamId",
                table: "Tag");

            migrationBuilder.DropIndex(
                name: "IX_Tag_TeamId",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "UsedCount",
                table: "Tag");

            migrationBuilder.CreateTable(
                name: "TagTeam",
                columns: table => new
                {
                    TagsIdentifier = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TeamsId = table.Column<string>(type: "nvarchar(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagTeam", x => new { x.TagsIdentifier, x.TeamsId });
                    table.ForeignKey(
                        name: "FK_TagTeam_Tag_TagsIdentifier",
                        column: x => x.TagsIdentifier,
                        principalTable: "Tag",
                        principalColumn: "Identifier",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagTeam_Teams_TeamsId",
                        column: x => x.TeamsId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TagTeam_TeamsId",
                table: "TagTeam",
                column: "TeamsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TagTeam");

            migrationBuilder.AddColumn<string>(
                name: "TeamId",
                table: "Tag",
                type: "nvarchar(10)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsedCount",
                table: "Tag",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Tag_TeamId",
                table: "Tag",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tag_Teams_TeamId",
                table: "Tag",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }
    }
}
