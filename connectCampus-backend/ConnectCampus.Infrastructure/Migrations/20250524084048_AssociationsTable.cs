using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AssociationsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Associations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    ShortDescription = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Logo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CoverImage = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Subcategories = table.Column<string>(type: "text", nullable: false),
                    FoundedYear = table.Column<int>(type: "integer", nullable: false),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    Members = table.Column<int>(type: "integer", nullable: false),
                    Events = table.Column<int>(type: "integer", nullable: false),
                    UpcomingEventsCount = table.Column<int>(type: "integer", nullable: true),
                    Rating = table.Column<double>(type: "double precision", nullable: true),
                    Followers = table.Column<int>(type: "integer", nullable: true),
                    Location = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Website = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Tags = table.Column<string>(type: "text", nullable: false),
                    Achievements = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Facebook = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Twitter = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Instagram = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    LinkedIn = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    LeadershipIds = table.Column<string>(type: "text", nullable: false),
                    UpcomingEventIds = table.Column<string>(type: "text", nullable: false),
                    PastEventIds = table.Column<string>(type: "text", nullable: false),
                    AnnouncementIds = table.Column<string>(type: "text", nullable: false),
                    Gallery = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Associations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Associations_Category",
                table: "Associations",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Associations_IsFeatured",
                table: "Associations",
                column: "IsFeatured");

            migrationBuilder.CreateIndex(
                name: "IX_Associations_IsVerified",
                table: "Associations",
                column: "IsVerified");

            migrationBuilder.CreateIndex(
                name: "IX_Associations_Name",
                table: "Associations",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Associations_Slug",
                table: "Associations",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Associations_UserId",
                table: "Associations",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Associations");
        }
    }
}
