using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Repositories
{
    public interface IPasswordResetTokensRepository
    {
        Task AddTokenAsync(string Email,string token, DateTime expiry);

        Task<PasswordResetToken> GetTokenAsync(string token);

        Task RemoveTokenAsync(string token);
    }
}
