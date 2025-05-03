using Amazon.Runtime.Internal.Util;
using AutoMapper;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service.Services
{
    public class ExpenseAndIncomeService : IExpenseAndIncomeService
    {
        private readonly IExpenseAndIncomeRepository _expenseRepository;
        private readonly ILogger<ExpenseAndIncomeService> _logger;
        private readonly IMapper _mapper;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITransactionDocumentService _fileService;

        public ExpenseAndIncomeService(IExpenseAndIncomeRepository expenseRepository, ILogger<ExpenseAndIncomeService> logger, IMapper mapper, ICategoryRepository categoryRepository, ITransactionDocumentService fileService)
        {
            _expenseRepository = expenseRepository;
            _logger = logger;
            _mapper = mapper;
            _categoryRepository = categoryRepository;
            _fileService = fileService;
        }

        public async Task<int> AddExpenseOrIncomeAsync(DateTime date, string category, int userId, string description, TransactionType typeTransaction, decimal sum, bool file, string? fileName, string? fileType, string fileSize, int? fixedExpenseAndIncomeId)
        {
            try
            {
                TransactionDocument? resultFile = null;
                if (file)
                {
                    var file1 = new FileDto { NameFile = fileName, Size = long.Parse(fileSize), TypeFile = fileType };
                    resultFile = await _fileService.AddTransactionDocumentAsync(file1);
                }

                var categoryExpense = await _categoryRepository.GetByNameAsync(category);

                var expense = new ExpenseAndIncome
                {
                    Date = date,
                    Category = categoryExpense,
                    UserId = userId,
                    Description = description,
                    TypeTransaction = typeTransaction,
                    Sum = sum,
                    FixedExpenseAndIncomeId = fixedExpenseAndIncomeId,
                    TransactionDocument = resultFile
                };

                var re = await _expenseRepository.AddExpenseOrIncomeAsynce(expense);

                _logger.LogInformation("Expense added successfully");

                return expense.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה בהוספת הוצאה: {ex.Message}");
                throw new Exception($"שגיאה בהוספת הוצאה: {ex.Message}");
            }
        }


        public async Task UpdateExpenseOrIncomeAsync(int expenseId, DateTime date, string category, string description, TransactionType typeTransaction, decimal sum, bool file, string? fileName, string? fileType, string fileSize, int? fixedExpenseAndIncomeId)
        {
            try
            {
                var categoryExpense = await _categoryRepository.GetByNameAsync(category);

                // קודם כל, נמצא את ההוצאה הקיימת
                var expense = await _expenseRepository.FindExpenseOrIncomeById(expenseId);
                if (expense == null)
                {
                    throw new Exception("ההוצאה לא נמצאה");
                }

                // אם יש קובץ חדש, נטפל בו
                TransactionDocument? resultFile = expense.TransactionDocument;

                if (file)
                {
                    // אם יש קובץ חדש, נוסיף אותו
                    var file1 = new FileDto { NameFile = fileName, Size = long.Parse(fileSize), TypeFile = fileType };
                    resultFile = await _fileService.AddTransactionDocumentAsync(file1);
                }

                // עדכון ההוצאה
                await _expenseRepository.UpdateExpenseOrIncomeAsync(expenseId, date, categoryExpense, description, typeTransaction, sum, fixedExpenseAndIncomeId, resultFile);

                _logger.LogInformation($"הוצאה {expenseId} עודכנה בהצלחה");
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה בעדכון הוצאה: {ex.Message}");
                throw new Exception($"שגיאה בעדכון הוצאה: {ex.Message}");
            }
        }

        public async Task<ExpenseAndIncome> GetExpenseOrIncomeByIdAsync(int expenseId)
        {
            try
            {
                var expense = await _expenseRepository.FindExpenseOrIncomeById(expenseId);
                if (expense == null)
                {
                    _logger.LogWarning($"הוצאה עם מזהה {expenseId} לא נמצאה.");
                    return null;
                }
                _logger.LogInformation($"get expense by Id {expenseId}");
                return expense;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור הוצאה: {ex.Message}");
                throw new Exception($"שגיאה באיתור הוצאה: {ex.Message}");
            }
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesOrIncomesAsync(TransactionType type)
        {
            try
            {
                var expenses = await _expenseRepository.GetAllExpensesOrIncomeAsync(type);
                _logger.LogInformation("get all expenses");
                return expenses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור כל ההוצאות: {ex.Message}");
                throw new Exception($"שגיאה באיתור כל ההוצאות: {ex.Message}");
            }
        }

        public async Task DeleteExpenseOrIncomeAsync(int expenseId)
        {
            try
            {
                await _expenseRepository.DeleteExpenseOrIncomeAsync(expenseId);
                _logger.LogInformation($"delete expense {expenseId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה במחיקת הוצאה: {ex.Message}");
                throw;
            }
        }

        public async Task<List<ExpenseRes>> GetExpensesOrIncomesByUserIdAsync(int userId, TransactionType type)
        {
            var result = await _expenseRepository.GetExpensesOrIncomeByUserIdAsync(userId, type);
            var resultList = result.ToList();

            return _mapper.Map<List<ExpenseRes>>(result);
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomesByCategoryAsync(CategoryExpenseAndIncome category)
        {
            try
            {
                var expenses = await _expenseRepository.GetExpensesOrIncomeByCategoryAsync(category);
                _logger.LogInformation($"get expenses by category {category}");
                return expenses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור הוצאות לפי קטגוריה: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesOrIncomesByDateRangeAsync(DateTime startDate, DateTime endDate, int userID, TransactionType type)
        {
            try
            {
                var expenses = await _expenseRepository.GetExpensesOrIncomeByDateRangeAndUserAsync(startDate, endDate, userID, type);
                _logger.LogInformation($"get expenses by date range {startDate} - {endDate}");
                return expenses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור הוצאות לפי טווח תאריכים: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<ExpenseRes>> GetTransactionsByDateCategoryAndUserAsync(DateTime startDate, DateTime endDate, int userID, TransactionType type, string Namecategory)
        {
            try
            {
                var category = await _categoryRepository.GetByNameAsync(Namecategory);

                var expenses = await _expenseRepository.GetTransactionsByDateCategoryAndUserAsync(startDate, endDate, type, category, userID);
                _logger.LogInformation($"get expenses by date range {startDate} - {endDate} and category {Namecategory} ");
                return _mapper.Map<List<ExpenseRes>>(expenses);
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור הוצאות לפי טווח תאריכים: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<ExpenseRes>> GetTransactionsAcordingYearAndUserAsync(int Year,int userID,TransactionType type)
        {
            try
            {
                var result=await _expenseRepository.GetTransactionsByYearAndUserAsync(Year,userID,type);
                _logger.LogInformation($"in service:: get {type} by year: {Year} ");
                return _mapper.Map<List<ExpenseRes>>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור הוצאות לפי טווח תאריכים: {ex.Message}");
                throw;
            }
        }
    }
}

