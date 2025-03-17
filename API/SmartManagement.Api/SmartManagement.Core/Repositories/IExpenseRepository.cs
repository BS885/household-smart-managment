using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Repositories
{
    public interface IExpenseRepository
    {
        ExpenseAndIncome AddExpense(ExpenseAndIncome expenseAndIncome);

        Task<ExpenseAndIncome> FindExpenseById(int id);

        Task UpdateExpenseAsync(int expenseId, DateTime date, CategoriesIncomeAndExpense category, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId);

        Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesAsync();

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesByUserIdAsync(int userId);

        Task DeleteExpenseAsync(int expenseId);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesByCategoryAsync(CategoriesIncomeAndExpense category);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate, int userID);
    }
}
