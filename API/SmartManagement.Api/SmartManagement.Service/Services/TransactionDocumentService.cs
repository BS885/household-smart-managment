using Microsoft.Extensions.Logging;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service.Services
{
    public class TransactionDocumentService : ITransactionDocumentService
    {
       
        private readonly ITransactionDocumentRepository _transactionDocumentRepository;
        private readonly ILogger<TransactionDocumentService> _logger;
        private readonly IExpenseService _expenseService;

        public TransactionDocumentService(ITransactionDocumentRepository transactionDocumentRepository, ILogger<TransactionDocumentService> logger, IExpenseService expenseService)
        {
            _transactionDocumentRepository = transactionDocumentRepository;
            _logger = logger;
            _expenseService = expenseService;
        }

        public async Task<TransactionDocument> GetTransactionDocumentByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Getting transaction document by ID: {id}");
                return await _transactionDocumentRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting transaction document by ID: {id}");
                throw;
            }
        }

        //public async Task<TransactionDocument> GetTransactionDocumentByTransactionIdAsync(int transactionID)
        //{
        //    var expens = await _expenseService.GetExpenseByIdAsync(transactionID);
        //    if (expens == null)
        //    {
        //        var errorMessage = $"Expense not found for transaction ID: {transactionID}";
        //        _logger.LogError(errorMessage);
        //        throw new Exception(errorMessage);
        //    }
        //    if (expens.TransactionDocument==null)
        //    {
        //        var errorMessage = $"Transaction document ID is null for expense with ID: {expens.Id}";
        //        _logger.LogError(errorMessage);
        //        throw new Exception(errorMessage);
        //    }
        //    // file = await _transactionDocumentRepository.GetByIdAsync(expens.TransactionDocument.Value);
        //    if (file == null)
        //    {
        //        var errorMessage = $"Transaction document not found for ID: {expens.IdTransactionDocument}";
        //        _logger.LogError(errorMessage);
        //        throw new Exception(errorMessage);
        //    }

        //    return file;
        //}

        public async Task AddTransactionDocumentAsync(TransactionDocument transactionDocument)
        {
            try
            {
                _logger.LogInformation($"Adding transaction document with ID: {transactionDocument.Id}");
                await _transactionDocumentRepository.AddAsync(transactionDocument);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding transaction document with ID: {transactionDocument.Id}");
                throw;
            }
        }

        public async Task UpdateTransactionDocumentAsync(TransactionDocument transactionDocument)
        {
            try
            {
                _logger.LogInformation($"Updating transaction document with ID: {transactionDocument.Id}");
                await _transactionDocumentRepository.UpdateAsync(transactionDocument);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating transaction document with ID: {transactionDocument.Id}");
                throw;
            }
        }

        public async Task DeleteTransactionDocumentAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Soft deleting transaction document with ID: {id}");
                var document = await _transactionDocumentRepository.GetByIdAsync(id);
                if (document != null)
                {
                    document.IsDeleted = true;
                    document.UpdatedAt = DateTime.UtcNow;
                    await _transactionDocumentRepository.UpdateAsync(document);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error soft deleting transaction document with ID: {id}");
                throw;
            }
        }
    }
}