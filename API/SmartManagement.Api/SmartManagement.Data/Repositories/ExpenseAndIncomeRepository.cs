using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.DTOs;
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
    public class ExpenseAndIncomeRepository : IExpenseAndIncomeRepository
    {

        private readonly DataContext _context;
        private readonly ILogger<ExpenseAndIncomeRepository> _logger;

        public ExpenseAndIncomeRepository(DataContext context, ILogger<ExpenseAndIncomeRepository> logger)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context), "DataContext is null in ExpenseRepository constructor");
            }

            _context = context;
            _logger = logger;
            _logger.LogInformation("ExpenseRepository instantiated successfully with a valid DataContext.");
        }


        public async Task<ExpenseAndIncome> AddExpenseOrIncomeAsynce(ExpenseAndIncome expenseAndIncome)
        { 
            _logger.LogInformation($"{expenseAndIncome.Description} Category = {expenseAndIncome.Category}");
            await _context.ExpensesAndIncomes.AddAsync(expenseAndIncome);
            await _context.SaveChangesAsync();
            return expenseAndIncome;
        }

        public async Task<ExpenseAndIncome> FindExpenseOrIncomeById(int id)
        {
            var result = await _context.ExpensesAndIncomes.Include(e => e.Category).FirstOrDefaultAsync(e => e.Id == id);

            _logger.LogInformation($"find expense by Id");
            return result;
        }

        public async Task UpdateExpenseOrIncomeAsync(int expenseId, DateTime date, CategoryExpenseAndIncome category, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId, TransactionDocument? resultFile)
        {
            try
            {
                var expense = await FindExpenseOrIncomeById(expenseId);

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

        public async Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesOrIncomeAsync(TransactionType type)
        {
            _logger.LogInformation("get all expenses");
            return await _context.ExpensesAndIncomes.Where(e => e.TypeTransaction == type).ToListAsync();
        }

        public async Task DeleteExpenseOrIncomeAsync(int expenseId)
        {
            try
            {
                var expense = await FindExpenseOrIncomeById(expenseId);

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

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomeByCategoryAsync(CategoryExpenseAndIncome category)
        {
            _logger.LogInformation($"get expenses by category {category}");

            return await _context.ExpensesAndIncomes
                .Include(e => e.Category) // טוען את הנווטות
                .Where(e => e.Category.Id == category.Id)
                .ToListAsync();
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomeByDateRangeAndUserAsync(DateTime startDate, DateTime endDate, int userID, TransactionType type)
        {
            _logger.LogInformation($"get {type} by date range {startDate} - {endDate}");

            return await _context.ExpensesAndIncomes.Where(e => e.UserId == userID && e.TypeTransaction == type && e.Date >= startDate && e.Date <= endDate).Include(e => e.Category).ToListAsync();
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomeByUserIdAsync(int userId, TransactionType type)
        {
            _logger.LogInformation("userID: " + userId);
            var rr = (int)type;
            var expenses = await _context.ExpensesAndIncomes
            .Where(e => e.UserId == userId && (int)e.TypeTransaction == (int)type)
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

        public async Task<IEnumerable<ExpenseAndIncome>> GetTransactionsByDateCategoryAndUserAsync(DateTime startDate, DateTime endDate, TransactionType type, CategoryExpenseAndIncome category, int useID)
        {
            _logger.LogInformation($"in repository expense an income:: get {type} by date range startDate: {startDate} - endDate: {endDate}");
            return await _context.ExpensesAndIncomes
                .Where(e => e.Date >= startDate && e.Date <= endDate && e.TypeTransaction == type && e.UserId == useID && e.Category == category)
                .Include(e => e.Category)
                .ToListAsync();
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetTransactionsByYearAndUserAsync(int year, int userID, TransactionType type)
        {
            _logger.LogInformation($"get {type} of year: {year} to user {userID}");
            return await _context.ExpensesAndIncomes
                 .Where(e => e.TypeTransaction == type && e.UserId == userID && e.Date.Year == year)
                  .Include(e => e.Category)
                  .ToListAsync();

        }
    }
}