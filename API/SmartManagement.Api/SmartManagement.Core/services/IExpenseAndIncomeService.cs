using SmartManagement.Core.DTOs;
using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IExpenseAndIncomeService
    {
        Task<int> AddExpenseOrIncomeAsync(DateTime date, string category, int userId, string description, TransactionType typeTransaction, decimal sum, bool file, string? fileName, string? fileType, string fileSize, int? fixedExpenseAndIncomeId,string? s3Key);

        Task UpdateExpenseOrIncomeAsync(int expenseId, DateTime date, string category, string description, TransactionType typeTransaction, decimal sum, bool file, string? fileName, string? fileType, string fileSize, int? fixedExpenseAndIncomeId);

        Task<ExpenseAndIncome> GetExpenseOrIncomeByIdAsync(int expenseId);

        Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesOrIncomesAsync(TransactionType type);

        Task DeleteExpenseOrIncomeAsync(int expenseId);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomesByCategoryAsync(CategoryExpenseAndIncome category);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomesByDateRangeAsync(DateTime startDate, DateTime endDate, int userID,TransactionType type);

        Task<List<ExpenseRes>> GetExpensesOrIncomesByUserIdAsync(int userId, TransactionType type);

        Task<IEnumerable<ExpenseRes>> GetTransactionsByDateCategoryAndUserAsync(DateTime startDate, DateTime endDate, int userID, TransactionType type, string Namecategory);

        Task<IEnumerable<ExpenseRes>> GetTransactionsAcordingYearAndUserAsync(int Year, int userID, TransactionType type);
    }
}
