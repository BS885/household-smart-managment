﻿using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data.Repositories
{
    public class TransactionDocumentRepository : ITransactionDocumentRepository
    {
        private readonly DataContext _context;

        public TransactionDocumentRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<TransactionDocument> GetByIdAsync(int id)
        {
            return await _context.TransactionDocuments.FirstOrDefaultAsync(u => u.Id == id && u.IsDeleted == false);
        }

        public async Task<IEnumerable<TransactionDocument>> GetAllAsync()
        {
            return await _context.TransactionDocuments
                    .Where(d => !d.IsDeleted)
                    .ToListAsync();
        }

        public async Task<TransactionDocument> AddAsync(TransactionDocument transactionDocument)
        {
            await _context.TransactionDocuments.AddAsync(transactionDocument);
            await _context.SaveChangesAsync();
            return transactionDocument;
        }

        public async Task UpdateAsync(TransactionDocument transactionDocument)
        {
            _context.Entry(transactionDocument).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var transactionDocument = await _context.TransactionDocuments.FindAsync(id);
            if (transactionDocument != null)
            {
                _context.TransactionDocuments.Remove(transactionDocument);
                await _context.SaveChangesAsync();
            }
        }

        public async Task SoftDeleteAsync(int id)
        {
            var transactionDocument = await _context.TransactionDocuments.FindAsync(id);
            if (transactionDocument != null)
            {
                transactionDocument.IsDeleted = true;
                transactionDocument.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }
}