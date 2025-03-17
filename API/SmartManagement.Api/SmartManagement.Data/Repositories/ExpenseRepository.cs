using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {

        private readonly DataContext _context;
        private readonly ILogger<ExpenseRepository> _logger;

        public ExpenseRepository(DataContext context, ILogger<ExpenseRepository> logger)
        {
            _context = context;
            _logger = logger;

        }

        public ExpenseAndIncome AddExpense(ExpenseAndIncome expenseAndIncome)
        {
            _context.ExpensesAndIncomes.Add(expenseAndIncome);
            _context.SaveChanges();
            return expenseAndIncome;
        }

        public async Task<ExpenseAndIncome> FindExpenseById(int id)
        {
            var result = await _context.ExpensesAndIncomes.FindAsync(id);
            _logger.LogInformation($"find expense by Id");
            return result;
        }

        public async Task UpdateExpenseAsync(int expenseId, DateTime date, CategoriesIncomeAndExpense category, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId)
        {
            try
            {
                var expense = await FindExpenseById(expenseId);

                if (expense != null)
                {
                    expense.Date= date;
                    expense.Category = category;
                    expense.Description = description;
                    expense.TypeTransaction = typeTransaction;
                    expense.Sum = sum;
                    expense.FixedExpenseAndIncomeId = fixedExpenseAndIncomeId;

                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"update expense {expenseId}");
                }
                else
                {
                    _logger.LogError("$\"הוצאה עם מזהה {expenseId} לא נמצאה.");
                    throw new Exception($"הוצאה עם מזהה {expenseId} לא נמצאה.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה בעדכון הוצאה: {ex.Message}");
                throw new Exception($"שגיאה בעדכון הוצאה: {ex.Message}");
            }
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesAsync()
        {
            _logger.LogInformation("get all expenses");
            return await _context.ExpensesAndIncomes.ToListAsync();
        }

        public async Task DeleteExpenseAsync(int expenseId)
        {
            try
            {
                var expense = await FindExpenseById(expenseId);
                if (expense != null)
                {
                    _context.ExpensesAndIncomes.Remove(expense);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"delete expense {expenseId}");
                }
                else
                {
                    _logger.LogError($"הוצאה עם מזהה {expenseId} לא נמצאה.");
                    throw new Exception($"הוצאה עם מזהה {expenseId} לא נמצאה.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה במחיקת הוצאה: {ex.Message}");
                throw new Exception($"שגיאה במחיקת הוצאה: {ex.Message}");
            }
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByCategoryAsync(CategoriesIncomeAndExpense category)
        {
            _logger.LogInformation($"get expenses by category {category}");
            return await _context.ExpensesAndIncomes.Where(e => e.Category == category).ToListAsync();
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate,int userID)
        {
            _logger.LogInformation($"get expenses by date range {startDate} - {endDate}");

            return await _context.ExpensesAndIncomes.Where(e =>  e.IdUser==userID &&e.Date >= startDate && e.Date <= endDate).ToListAsync();
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByUserIdAsync(int userId)
        {
            return await _context.ExpensesAndIncomes
                                 .Where(e => e.IdUser == userId)
                                 .ToListAsync();
        }
    }
}