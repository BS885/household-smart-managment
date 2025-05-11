using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users
          .Include(ur => ur.Roles)
           .ThenInclude(r => r.Permissions)
           .FirstOrDefaultAsync(u => u.Email == email);
        }

        public User GetUserById(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == id);
            return user;
        }

        public void AddUser(User user)
        {

            _context.Users.Add(user);

            _context.SaveChanges();
        }

        public void UpdateUser(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }


        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

    }
}
