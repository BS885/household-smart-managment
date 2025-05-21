using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IUserService
    {
        Task UpdateUser(int id, string name, string address, string city, string phone);
        string GetUserIdFromToken(ClaimsPrincipal user);
        Task<UserDto> UpdateRoleToUserAsync(UpdateUserRoleDto updateUser,int id);
        Task<IEnumerable<UserDto>> GetUsers();

    }
}
