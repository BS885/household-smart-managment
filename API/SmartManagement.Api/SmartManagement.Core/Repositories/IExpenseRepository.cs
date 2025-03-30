using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Repositories
{
    public interface IExpenseAndIncomeRepository
    {
        Task<ExpenseAndIncome> AddExpenseOrIncomeAsynce(ExpenseAndIncome expenseAndIncome);

        Task<ExpenseAndIncome> FindExpenseOrIncomeById(int id);

        Task UpdateExpenseOrIncomeAsync(int expenseId, DateTime date, CategoryExpenseAndIncome category, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId, TransactionDocument? resultFile);

        Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesOrIncomeAsync(TransactionType type);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomeByUserIdAsync(int userId, TransactionType type);

        Task DeleteExpenseOrIncomeAsync(int expenseId);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomeByCategoryAsync(CategoryExpenseAndIncome category);

        Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomeByDateRangeAsync(DateTime startDate, DateTime endDate, int userID,TransactionType type);
    }
}
