using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAssociationStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Associations_Category",
                table: "Associations");

            migrationBuilder.DropIndex(
                name: "IX_Associations_IsFeatured",
                table: "Associations");

            migrationBuilder.DropIndex(
                name: "IX_Associations_IsVerified",
                table: "Associations");

            migrationBuilder.DropIndex(
                name: "IX_Associations_Name",
                table: "Associations");

            migrationBuilder.AddColumn<Guid>(
                name: "AssociationId1",
                table: "Events",
                type: "uuid",
                nullable: true);

            migrationBuilder.DropColumn(
                name: "UpcomingEventIds",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "PastEventIds",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "LeadershipIds",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "AnnouncementIds",
                table: "Associations");

            migrationBuilder.CreateIndex(
                name: "IX_Events_AssociationId1",
                table: "Events",
                column: "AssociationId1");

            migrationBuilder.CreateIndex(
                name: "IX_Associations_Email",
                table: "Associations",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Associations_Users_UserId",
                table: "Associations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Associations_AssociationId1",
                table: "Events",
                column: "AssociationId1",
                principalTable: "Associations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Associations_Users_UserId",
                table: "Associations");

            migrationBuilder.DropForeignKey(
                name: "FK_Events_Associations_AssociationId1",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_AssociationId1",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Associations_Email",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "AssociationId1",
                table: "Events");

            migrationBuilder.AddColumn<string>(
                name: "UpcomingEventIds",
                table: "Associations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PastEventIds",
                table: "Associations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LeadershipIds",
                table: "Associations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AnnouncementIds",
                table: "Associations",
                type: "text",
                nullable: false,
                defaultValue: "");

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
        }
    }
}
