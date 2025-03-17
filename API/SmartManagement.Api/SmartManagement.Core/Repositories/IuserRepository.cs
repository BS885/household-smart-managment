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
        User GetUserByEmail(string email);

        void AddUser(User user);

        User GetUserById(int id);

        void UpdateUser(User user);
    }
}
