using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Repositories
{
    public interface ITransactionDocumentRepository
    {
        Task<TransactionDocument> GetByIdAsync(int id);
        Task<IEnumerable<TransactionDocument>> GetAllAsync();
        Task<TransactionDocument> AddAsync(TransactionDocument transactionDocument);
        Task UpdateAsync(TransactionDocument transactionDocument);
        Task DeleteAsync(int id);
        Task<IEnumerable<TransactionDocument>> GetByTransactionIdAsync(int transactionId);
    }
}
