﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using api.Data;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(PokeTeamContext))]
    [Migration("20250531215313_DexNumberToPokemonId")]
    partial class DexNumberToPokemonId
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Country", b =>
                {
                    b.Property<string>("NormalizedName")
                        .HasColumnType("text");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("NormalizedName");

                    b.ToTable("Country");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Pokemon", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("AbilityIdentifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<int?>("EV_atk")
                        .HasColumnType("integer");

                    b.Property<int?>("EV_def")
                        .HasColumnType("integer");

                    b.Property<int?>("EV_hp")
                        .HasColumnType("integer");

                    b.Property<int?>("EV_spa")
                        .HasColumnType("integer");

                    b.Property<int?>("EV_spd")
                        .HasColumnType("integer");

                    b.Property<int?>("EV_spe")
                        .HasColumnType("integer");

                    b.Property<int?>("FormId")
                        .HasColumnType("integer");

                    b.Property<bool?>("Gender")
                        .HasColumnType("boolean");

                    b.Property<int?>("IV_atk")
                        .HasColumnType("integer");

                    b.Property<int?>("IV_def")
                        .HasColumnType("integer");

                    b.Property<int?>("IV_hp")
                        .HasColumnType("integer");

                    b.Property<int?>("IV_spa")
                        .HasColumnType("integer");

                    b.Property<int?>("IV_spd")
                        .HasColumnType("integer");

                    b.Property<int?>("IV_spe")
                        .HasColumnType("integer");

                    b.Property<string>("ItemIdentifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<int?>("Level")
                        .HasColumnType("integer");

                    b.Property<string>("Move1Identifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Move2Identifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Move3Identifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Move4Identifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("NatureIdentifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Nickname")
                        .HasMaxLength(16)
                        .HasColumnType("character varying(16)");

                    b.Property<string>("Notes")
                        .HasMaxLength(2048)
                        .HasColumnType("character varying(2048)");

                    b.Property<int>("PokemonId")
                        .HasColumnType("integer");

                    b.Property<bool?>("Shiny")
                        .HasColumnType("boolean");

                    b.Property<string>("TeamId")
                        .IsRequired()
                        .HasColumnType("character varying(10)");

                    b.Property<string>("TeraTypeIdentifier")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.HasKey("Id");

                    b.HasIndex("TeamId");

                    b.ToTable("Pokemon");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Regulation", b =>
                {
                    b.Property<string>("Identifier")
                        .HasMaxLength(2)
                        .HasColumnType("character varying(2)");

                    b.Property<DateOnly?>("EndDate")
                        .HasColumnType("date");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<DateOnly?>("StartDate")
                        .HasColumnType("date");

                    b.HasKey("Identifier");

                    b.ToTable("Regulation");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Tag", b =>
                {
                    b.Property<string>("Identifier")
                        .HasMaxLength(16)
                        .HasColumnType("character varying(16)");

                    b.Property<int>("Color")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("character varying(16)");

                    b.HasKey("Identifier");

                    b.ToTable("Tag");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Team", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(10)
                        .HasColumnType("character varying(10)");

                    b.Property<string>("AnonPlayer")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("EVsVisibility")
                        .HasColumnType("boolean");

                    b.Property<bool>("IVsVisibility")
                        .HasColumnType("boolean");

                    b.Property<bool>("NaturesVisibility")
                        .HasColumnType("boolean");

                    b.Property<string>("PlayerId")
                        .HasMaxLength(450)
                        .HasColumnType("character varying(450)");

                    b.Property<string>("Regulation")
                        .HasColumnType("text");

                    b.Property<string>("RentalCode")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.PrimitiveCollection<string[]>("TagIds")
                        .HasColumnType("text[]");

                    b.Property<string>("TournamentNormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<int>("ViewCount")
                        .HasColumnType("integer");

                    b.Property<bool>("Visibility")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.HasIndex("TournamentNormalizedName");

                    b.ToTable("Team");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Tournament", b =>
                {
                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("Category")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("City")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("CountryCode")
                        .HasMaxLength(2)
                        .HasColumnType("character varying(2)");

                    b.Property<DateOnly?>("EndDate")
                        .HasColumnType("date");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("Official")
                        .HasColumnType("boolean");

                    b.Property<string>("ShortName")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<DateOnly?>("StartDate")
                        .HasColumnType("date");

                    b.HasKey("NormalizedName");

                    b.ToTable("Tournament");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Country")
                        .HasMaxLength(2)
                        .HasColumnType("character varying(2)");

                    b.Property<DateOnly>("DateCreated")
                        .HasColumnType("date");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("Picture")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("text");

                    b.Property<DateTime>("RefreshTokenExpiryTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<byte[]>("RowVersion")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("bytea");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<bool>("Visibility")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .IsUnique()
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("api.Models.DBPoketeamModels.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("api.Models.DBPoketeamModels.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Models.DBPoketeamModels.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("api.Models.DBPoketeamModels.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Pokemon", b =>
                {
                    b.HasOne("api.Models.DBPoketeamModels.Team", "Team")
                        .WithMany("Pokemons")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Team");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Team", b =>
                {
                    b.HasOne("api.Models.DBPoketeamModels.User", "Player")
                        .WithMany("Teams")
                        .HasForeignKey("PlayerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("api.Models.DBPoketeamModels.Tournament", "Tournament")
                        .WithMany("Teams")
                        .HasForeignKey("TournamentNormalizedName");

                    b.Navigation("Player");

                    b.Navigation("Tournament");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Team", b =>
                {
                    b.Navigation("Pokemons");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.Tournament", b =>
                {
                    b.Navigation("Teams");
                });

            modelBuilder.Entity("api.Models.DBPoketeamModels.User", b =>
                {
                    b.Navigation("Teams");
                });
#pragma warning restore 612, 618
        }
    }
}
