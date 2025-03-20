using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmartManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class addrole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoleUser",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IdTransactionDocument",
                table: "ExpensesAndIncomes");

            migrationBuilder.AddColumn<int>(
                name: "TransactionDocumentId",
                table: "ExpensesAndIncomes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ISExpense",
                table: "CategoriesExpenseAndIncome",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsIncome",
                table: "CategoriesExpenseAndIncome",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RoleName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "RoleName" },
                values: new object[,]
                {
                    { 1, "User" },
                    { 2, "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesAndIncomes_FixedExpenseAndIncomeId",
                table: "ExpensesAndIncomes",
                column: "FixedExpenseAndIncomeId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesAndIncomes_TransactionDocumentId",
                table: "ExpensesAndIncomes",
                column: "TransactionDocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesAndIncomes_UserId",
                table: "ExpensesAndIncomes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExpensesAndIncomes_FixedExpensesAndIncomes_FixedExpenseAndIn~",
                table: "ExpensesAndIncomes",
                column: "FixedExpenseAndIncomeId",
                principalTable: "FixedExpensesAndIncomes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ExpensesAndIncomes_TransactionDocuments_TransactionDocumentId",
                table: "ExpensesAndIncomes",
                column: "TransactionDocumentId",
                principalTable: "TransactionDocuments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ExpensesAndIncomes_Users_UserId",
                table: "ExpensesAndIncomes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExpensesAndIncomes_FixedExpensesAndIncomes_FixedExpenseAndIn~",
                table: "ExpensesAndIncomes");

            migrationBuilder.DropForeignKey(
                name: "FK_ExpensesAndIncomes_TransactionDocuments_TransactionDocumentId",
                table: "ExpensesAndIncomes");

            migrationBuilder.DropForeignKey(
                name: "FK_ExpensesAndIncomes_Users_UserId",
                table: "ExpensesAndIncomes");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_ExpensesAndIncomes_FixedExpenseAndIncomeId",
                table: "ExpensesAndIncomes");

            migrationBuilder.DropIndex(
                name: "IX_ExpensesAndIncomes_TransactionDocumentId",
                table: "ExpensesAndIncomes");

            migrationBuilder.DropIndex(
                name: "IX_ExpensesAndIncomes_UserId",
                table: "ExpensesAndIncomes");

            migrationBuilder.DropColumn(
                name: "TransactionDocumentId",
                table: "ExpensesAndIncomes");

            migrationBuilder.DropColumn(
                name: "ISExpense",
                table: "CategoriesExpenseAndIncome");

            migrationBuilder.DropColumn(
                name: "IsIncome",
                table: "CategoriesExpenseAndIncome");

            migrationBuilder.AddColumn<int>(
                name: "RoleUser",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdTransactionDocument",
                table: "ExpensesAndIncomes",
                type: "int",
                nullable: true);
        }
    }
}
