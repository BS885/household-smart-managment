using AutoMapper;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.DTOs;
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
        private readonly IMapper _mapper;
        private readonly Is3Service _s3Service;

        public TransactionDocumentService(ITransactionDocumentRepository transactionDocumentRepository, ILogger<TransactionDocumentService> logger, IMapper mapper, Is3Service s3Service)
        {
            _transactionDocumentRepository = transactionDocumentRepository;
            _logger = logger;
            _mapper = mapper;
            _s3Service = s3Service;
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


        public async Task<TransactionDocument> AddTransactionDocumentAsync(FileDto transactionDocument)
        {
            try
            {
                _logger.LogInformation($"Adding transaction document with ");
                var file = _mapper.Map<TransactionDocument>(transactionDocument);
                await _transactionDocumentRepository.AddAsync(file);
                return file;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding transaction document ");
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
                _logger.LogInformation($"deleting transaction document with ID: {id}");
                var document = await _transactionDocumentRepository.GetByIdAsync(id);

                if (document != null)
                {
                    //document.IsDeleted = true;
                   // document.UpdatedAt = DateTime.UtcNow;
                    await _s3Service.DeleteFileAsync(document.FileName);
                    await _transactionDocumentRepository.DeleteAsync(id);
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