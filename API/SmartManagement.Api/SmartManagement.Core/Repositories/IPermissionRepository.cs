using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Repositories
{
    public interface IPermissionRepository
    {

        Task<IEnumerable<Permission>> GetAllPermissionsAsync();
        Task<IEnumerable<Permission>> GetPermissionsByRoleIdAsync(int roleId);
        Task<Permission> GetPermissionByNameAsync(string name);
        Task<Role> GetRoleByNameAsync(string name);
        Task<Permission> GetPermissionByIdAsync(int id);
        Task<Role> GetRoleByIdAsync(int id);

        Task RemovePermissionFromRoleAsync(int roleId, int permissionId);
        Task<bool> RoleHasPermissionAsync(int roleId, string permissionName);

        Task AddPermissionToRoleAsync(int roleId, int permissionId);
        Task<Permission> AddPermissionAsync(string name, string description);
        Task RemovePermissionAsync(Permission permission);
      
    }

}

