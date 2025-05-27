using Amazon.Runtime.Internal;
using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data.Repositories
{
    public class PasswordResetTokensRepository : IPasswordResetTokensRepository
    {
        private readonly DataContext _context;

        public PasswordResetTokensRepository(DataContext context)
        {
            _context = context;
        }
        public async Task AddTokenAsync(string Email, string token, DateTime expiry)
        {
            _context.PasswordResetTokens.Add(new PasswordResetToken
            {
                Email = Email,
                Token = token,
                ExpiryDate = expiry
            });
            await _context.SaveChangesAsync();

        }

        public async Task<PasswordResetToken> GetTokenAsync(string token)
        {
            return await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Token == token && t.ExpiryDate > DateTime.UtcNow);
        }

        public async Task RemoveTokenAsync(string token)
        {
            var tokenToRemove = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Token == token);
            if (tokenToRemove != null)
            {
                _context.PasswordResetTokens.Remove(tokenToRemove);
                await _context.SaveChangesAsync();
            }
        }
    }
}
