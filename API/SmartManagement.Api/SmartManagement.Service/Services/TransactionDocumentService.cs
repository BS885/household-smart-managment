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
    public class TransactionDocumentService: ITransactionDocumentService
    {
        private readonly ITransactionDocumentRepository _transactionDocumentRepository;
        private readonly ILogger<TransactionDocumentService> _logger;
        public TransactionDocumentService(ITransactionDocumentRepository transactionDocumentRepository, ILogger<TransactionDocumentService> logger)
        {
            _transactionDocumentRepository = transactionDocumentRepository;
            _logger = logger;
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
                throw ex;
            }
        }

        public async Task<IEnumerable<TransactionDocument>> GetAllTransactionDocumentsAsync()
        {
            try
            {
                _logger.LogInformation("Getting all transaction documents");
                return await _transactionDocumentRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all transaction documents");
                throw ex;
            }
        }

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
                throw ex;
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
                throw ex;
            }
        }

        public async Task DeleteTransactionDocumentAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting transaction document with ID: {id}");
                await _transactionDocumentRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting transaction document with ID: {id}");
                throw ex;
            }
        }

        public async Task<IEnumerable<TransactionDocument>> GetTransactionDocumentsByTransactionIdAsync(int transactionId)
        {
            try
            {
                _logger.LogInformation($"Getting transaction documents by transaction ID: {transactionId}");
                return await _transactionDocumentRepository.GetByTransactionIdAsync(transactionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting transaction documents by transaction ID: {transactionId}");
                throw ex;
            }
        }
    }
}