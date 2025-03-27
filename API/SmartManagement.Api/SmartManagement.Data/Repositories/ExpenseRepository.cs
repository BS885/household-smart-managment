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
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context), "DataContext is null in ExpenseRepository constructor");
            }

            _context = context;
            _logger = logger;
            _logger.LogInformation("ExpenseRepository instantiated successfully with a valid DataContext.");
        }


        public async Task<ExpenseAndIncome> AddExpenseAsynce(ExpenseAndIncome expenseAndIncome)
        {
            await _context.ExpensesAndIncomes.AddAsync(expenseAndIncome);
            await _context.SaveChangesAsync();
            return expenseAndIncome;
        }

        public async Task<ExpenseAndIncome> FindExpenseById(int id)
        {
            var result = await _context.ExpensesAndIncomes.Include(e => e.Category).FirstOrDefaultAsync(e => e.Id == id);
            
            _logger.LogInformation($"find expense by Id");
            return result;
        }

        public async Task UpdateExpenseAsync(int expenseId, DateTime date, CategoryExpenseAndIncome category, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId, TransactionDocument? resultFile)
        {
            try
            {
                var expense = await FindExpenseById(expenseId);

                if (expense != null)
                {
                    expense.Date = date;
                    expense.Category = category;
                    expense.Description = description;
                    expense.TypeTransaction = typeTransaction;
                    expense.Sum = sum;
                    expense.FixedExpenseAndIncomeId = fixedExpenseAndIncomeId;
                    expense.TransactionDocument = resultFile;

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

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByCategoryAsync(CategoryExpenseAndIncome category)
        {
            _logger.LogInformation($"get expenses by category {category}");

            return await _context.ExpensesAndIncomes
                .Include(e => e.Category) // טוען את הנווטות
                .Where(e => e.Category.Id == category.Id)
                .ToListAsync();
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate, int userID)
        {
            _logger.LogInformation($"get expenses by date range {startDate} - {endDate}");

            return await _context.ExpensesAndIncomes.Where(e => e.UserId == userID && e.Date >= startDate && e.Date <= endDate).Include(e => e.Category).ToListAsync();
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByUserIdAsync(int userId)
        {
            _logger.LogInformation("userID: " + userId);

            var expenses = await _context.ExpensesAndIncomes
            .Where(e => e.UserId == userId)
            .Include(e => e.Category)
            .Include(e => e.TransactionDocument)
             .ToListAsync(); // מבצע את השאילתה בפועל

            if (expenses == null || expenses.Count == 0)
            {
                _logger.LogWarning($"⚠️ לא נמצאו נתונים עבור המשתמש עם ID {userId}");
                return new List<ExpenseAndIncome>(); // מחזיר רשימה ריקה במקום null
            }

            return expenses;
        }


    }
}