using Microsoft.EntityFrameworkCore.Migrations;

namespace splat.Migrations
{
    public partial class AddExampleNewValue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NewValue",
                table: "Examples",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewValue",
                table: "Examples");
        }
    }
}
