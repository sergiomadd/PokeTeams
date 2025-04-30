using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class Reset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Country = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: true),
                    Picture = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    DateCreated = table.Column<DateOnly>(type: "date", nullable: false),
                    Visibility = table.Column<bool>(type: "boolean", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "bytea", rowVersion: true, nullable: true),
                    UserName = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Country",
                columns: table => new
                {
                    NormalizedName = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.NormalizedName);
                });

            migrationBuilder.CreateTable(
                name: "Regulation",
                columns: table => new
                {
                    Identifier = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regulation", x => x.Identifier);
                });

            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    Identifier = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Name = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Description = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Color = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Identifier);
                });

            migrationBuilder.CreateTable(
                name: "Tournament",
                columns: table => new
                {
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ShortName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    City = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    CountryCode = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: true),
                    Official = table.Column<bool>(type: "boolean", nullable: false),
                    Category = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournament", x => x.NormalizedName);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Team",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    PlayerId = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: true),
                    AnonPlayer = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    TournamentNormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Regulation = table.Column<string>(type: "text", nullable: true),
                    TagIds = table.Column<string[]>(type: "text[]", nullable: false),
                    RentalCode = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    ViewCount = table.Column<int>(type: "integer", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Visibility = table.Column<bool>(type: "boolean", nullable: false),
                    IVsVisibility = table.Column<bool>(type: "boolean", nullable: false),
                    EVsVisibility = table.Column<bool>(type: "boolean", nullable: false),
                    NaturesVisibility = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Team", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Team_AspNetUsers_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Team_Tournament_TournamentNormalizedName",
                        column: x => x.TournamentNormalizedName,
                        principalTable: "Tournament",
                        principalColumn: "NormalizedName");
                });

            migrationBuilder.CreateTable(
                name: "Pokemon",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeamId = table.Column<string>(type: "character varying(10)", nullable: false),
                    DexNumber = table.Column<int>(type: "integer", nullable: true),
                    FormId = table.Column<int>(type: "integer", nullable: true),
                    Nickname = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    TeraTypeIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    ItemIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    AbilityIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    NatureIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move1Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move2Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move3Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move4Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Level = table.Column<int>(type: "integer", nullable: true),
                    Shiny = table.Column<bool>(type: "boolean", nullable: true),
                    Gender = table.Column<bool>(type: "boolean", nullable: true),
                    Notes = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    IV_hp = table.Column<int>(type: "integer", nullable: true),
                    IV_atk = table.Column<int>(type: "integer", nullable: true),
                    IV_def = table.Column<int>(type: "integer", nullable: true),
                    IV_spa = table.Column<int>(type: "integer", nullable: true),
                    IV_spd = table.Column<int>(type: "integer", nullable: true),
                    IV_spe = table.Column<int>(type: "integer", nullable: true),
                    EV_hp = table.Column<int>(type: "integer", nullable: true),
                    EV_atk = table.Column<int>(type: "integer", nullable: true),
                    EV_def = table.Column<int>(type: "integer", nullable: true),
                    EV_spa = table.Column<int>(type: "integer", nullable: true),
                    EV_spd = table.Column<int>(type: "integer", nullable: true),
                    EV_spe = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pokemon", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pokemon_Team_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Team",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pokemon_TeamId",
                table: "Pokemon",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Team_PlayerId",
                table: "Team",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Team_TournamentNormalizedName",
                table: "Team",
                column: "TournamentNormalizedName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Country");

            migrationBuilder.DropTable(
                name: "Pokemon");

            migrationBuilder.DropTable(
                name: "Regulation");

            migrationBuilder.DropTable(
                name: "Tag");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Team");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Tournament");
        }
    }
}
