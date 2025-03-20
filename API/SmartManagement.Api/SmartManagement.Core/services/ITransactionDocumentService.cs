using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface ITransactionDocumentService
    {
        Task<TransactionDocument> GetTransactionDocumentByIdAsync(int id);
        //Task<TransactionDocument> GetTransactionDocumentByTransactionIdAsync(int transactionID);
        Task AddTransactionDocumentAsync(TransactionDocument transactionDocument);
        Task UpdateTransactionDocumentAsync(TransactionDocument transactionDocument);
        Task DeleteTransactionDocumentAsync(int id);
    }
}
