using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IPermissionService
    {
        Task<PermissionDto> AddPermissionAsync(string name, string description);
        Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync();
        Task<Permission> GetPermissionByIdAsync(int id);
        Task DeletePermissionAsync(int id);
        Task<IEnumerable<PermissionDto>> GetPermissionsByRoleIdAsync(int roleId);
        Task AddPermissionToRoleAsync(string roleName, string permissionName);
        Task RemovePermissionFromRoleAsync(string roleName, string permissionName);
        Task<bool> RoleHasPermissionAsync(int roleId, string permissionName);
        Task<Role> GetRoleByIdAsync(int id);
        Task<Role> GetRoleByNameAsync(string roleName);


    }
}
