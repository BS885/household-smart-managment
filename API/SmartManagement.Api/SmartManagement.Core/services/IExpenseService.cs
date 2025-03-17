using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IExpenseService
    {
        Task<int> AddExpenseAsync(DateTime date, CategoriesIncomeAndExpense category, int userId, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId);

        Task UpdateExpenseAsync(int expenseId, DateTime date, CategoriesIncomeAndExpense category, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId);

        Task<ExpenseAndIncome> GetExpenseByIdAsync(int expenseId);

        Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesAsync();

        Task DeleteExpenseAsync(int expenseId);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesByCategoryAsync(CategoriesIncomeAndExpense category);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate, int userID);

    }
}
