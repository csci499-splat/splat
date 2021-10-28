using Microsoft.EntityFrameworkCore.Migrations;

namespace splat.Migrations
{
    public partial class AddUserEmailPickup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserEmail",
                table: "Pickups",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationUserEmail",
                table: "Pickups");
        }
    }
}
