using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class StudentsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    JoinedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Bio = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AvatarUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    University = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Faculty = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Specialization = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    StudyYear = table.Column<int>(type: "integer", nullable: false),
                    EducationLevel = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LinkedInUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    GitHubUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FacebookUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Interests = table.Column<string>(type: "text", nullable: false),
                    FavoriteEventIds = table.Column<string>(type: "text", nullable: false),
                    RegisteredEventIds = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Students_Email",
                table: "Students",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Students");
        }
    }
}
