using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmartManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class entercateegories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CategoriesExpenseAndIncome",
                columns: new[] { "Id", "Description", "ISExpense", "IsIncome", "Name" },
                values: new object[,]
                {
                    { 1, "קניות בסופר, מסעדות ובתי קפה", true, false, "אוכל" },
                    { 2, "דלק, תחבורה ציבורית, רכב", true, false, "תחבורה" },
                    { 3, "שכר דירה, משכנתא, חשבונות בית", true, false, "דיור" },
                    { 4, "קניית בגדים, נעליים ואביזרים", true, false, "ביגוד והנעלה" },
                    { 5, "ביטוח רפואי, תרופות, טיפולי שיניים", true, false, "בריאות" },
                    { 6, "קולנוע, תיאטרון, טיולים", true, false, "בילויים ופנאי" },
                    { 7, "שכר לימוד, ספרים, קורסים", true, false, "חינוך" },
                    { 8, "ריהוט, כלי בית, תחזוקה", true, false, "מוצרים לבית" },
                    { 9, "ארנונה, חשמל, מים, גז, אינטרנט", true, false, "תשלומים חודשיים" },
                    { 10, "הוצאות בלתי צפויות", true, false, "שונות" },
                    { 11, "הכנסה מעבודה חודשית", false, true, "משכורת" },
                    { 12, "רווחים מעסק עצמאי", false, true, "הכנסה מעסק" },
                    { 13, "רווחים מהשקעות במניות, קרנות", false, true, "השקעות" },
                    { 14, "הכנסות מביטוח לאומי, פנסיה", false, true, "קצבאות" },
                    { 15, "הכנסות צדדיות, עבודות זמניות", false, true, "הכנסות נוספות" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 15);
        }
    }
}
