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
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;
        private readonly ILogger<ExpenseService> _logger;
        private readonly IMapper _mapper;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITransactionDocumentService _fileService;

        public ExpenseService(IExpenseRepository expenseRepository, ILogger<ExpenseService> logger, IMapper mapper, ICategoryRepository categoryRepository, ITransactionDocumentService fileService)
        {
            _expenseRepository = expenseRepository;
            _logger = logger;
            _mapper = mapper;
            _categoryRepository = categoryRepository;
            _fileService = fileService;
        }

        public async Task<int> AddExpenseAsync(DateTime date, string category, int userId, string description, TransactionType typeTransaction, decimal sum, bool file, string? fileName, string? fileType, string fileSize, int? fixedExpenseAndIncomeId)
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

                var re = await _expenseRepository.AddExpenseAsynce(expense);

                _logger.LogInformation("Expense added successfully");

                return expense.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה בהוספת הוצאה: {ex.Message}");
                throw new Exception($"שגיאה בהוספת הוצאה: {ex.Message}");
            }
        }

        public async Task UpdateExpenseAsync(int expenseId, DateTime date, string category, string description, TransactionType typeTransaction, decimal sum, int? fixedExpenseAndIncomeId)
        {
            try
            {
                var categoryExpense = await _categoryRepository.GetByNameAsync(category);

                await _expenseRepository.UpdateExpenseAsync(expenseId, date, categoryExpense, description, typeTransaction, sum, fixedExpenseAndIncomeId);
                _logger.LogInformation($"update expense {expenseId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה בעדכון הוצאה: {ex.Message}");
                throw new Exception($"שגיאה בעדכון הוצאה: {ex.Message}");
            }
        }

        public async Task<ExpenseAndIncome> GetExpenseByIdAsync(int expenseId)
        {
            try
            {
                var expense = await _expenseRepository.FindExpenseById(expenseId);
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

        public async Task<IEnumerable<ExpenseAndIncome>> GetAllExpensesAsync()
        {
            try
            {
                var expenses = await _expenseRepository.GetAllExpensesAsync();
                _logger.LogInformation("get all expenses");
                return expenses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור כל ההוצאות: {ex.Message}");
                throw new Exception($"שגיאה באיתור כל ההוצאות: {ex.Message}");
            }
        }

        public async Task DeleteExpenseAsync(int expenseId)
        {
            try
            {
                await _expenseRepository.DeleteExpenseAsync(expenseId);
                _logger.LogInformation($"delete expense {expenseId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה במחיקת הוצאה: {ex.Message}");
                throw;
            }
        }

        public async Task<List<ExpenseRes>> GetExpensesByUserIdAsync(int userId)
        {
            var result = await _expenseRepository.GetExpensesByUserIdAsync(userId);
            var resultList = result.ToList();
            return _mapper.Map<List<ExpenseRes>>(result);
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByCategoryAsync(CategoryExpenseAndIncome category)
        {
            try
            {
                var expenses = await _expenseRepository.GetExpensesByCategoryAsync(category);
                _logger.LogInformation($"get expenses by category {category}");
                return expenses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור הוצאות לפי קטגוריה: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<ExpenseAndIncome>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate, int userID)
        {
            try
            {
                var expenses = await _expenseRepository.GetExpensesByDateRangeAsync(startDate, endDate, userID);
                _logger.LogInformation($"get expenses by date range {startDate} - {endDate}");
                return expenses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה באיתור הוצאות לפי טווח תאריכים: {ex.Message}");
                throw;
            }
        }


    }
}

