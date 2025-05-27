using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByEmailAsync(string email);

        void AddUser(User user);

        Task<User> GetUserById(int id);

        Task UpdateUserAsync(User user);

        Task<IEnumerable<UserDto>> GetUsers();

        Task UpdateUserLogin(User user);
    }
}
