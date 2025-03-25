using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class TransactionDocumentnullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExpensesAndIncomes_TransactionDocuments_TransactionDocumentId",
                table: "ExpensesAndIncomes");

            migrationBuilder.AlterColumn<int>(
                name: "TransactionDocumentId",
                table: "ExpensesAndIncomes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_ExpensesAndIncomes_TransactionDocuments_TransactionDocumentId",
                table: "ExpensesAndIncomes",
                column: "TransactionDocumentId",
                principalTable: "TransactionDocuments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExpensesAndIncomes_TransactionDocuments_TransactionDocumentId",
                table: "ExpensesAndIncomes");

            migrationBuilder.AlterColumn<int>(
                name: "TransactionDocumentId",
                table: "ExpensesAndIncomes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ExpensesAndIncomes_TransactionDocuments_TransactionDocumentId",
                table: "ExpensesAndIncomes",
                column: "TransactionDocumentId",
                principalTable: "TransactionDocuments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
