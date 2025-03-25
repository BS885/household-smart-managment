using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class addpermition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_FixedExpensesAndIncomes_UserId",
                table: "FixedExpensesAndIncomes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FixedExpensesAndIncomes_Users_UserId",
                table: "FixedExpensesAndIncomes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FixedExpensesAndIncomes_Users_UserId",
                table: "FixedExpensesAndIncomes");

            migrationBuilder.DropIndex(
                name: "IX_FixedExpensesAndIncomes_UserId",
                table: "FixedExpensesAndIncomes");
        }
    }
}
