using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
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

        public async Task<User> GetUserById(int id)
        {
            var user = await _context.Users
               .Include(u => u.Roles)
                //.ThenInclude(ur => ur.RoleName)
                .FirstOrDefaultAsync(u => u.UserId == id);
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


        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Roles)
                .Select(u => new UserDto
                {
                    Id = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Address = u.Address,
                    City = u.City,
                    CreateIn = DateOnly.FromDateTime(u.CreatedDate),
                    Phone = u.Phone,
                    Roles = u.Roles.Select(r => r.RoleName).ToList()
                })
                .ToListAsync();

            return users;
        }

    }
}
