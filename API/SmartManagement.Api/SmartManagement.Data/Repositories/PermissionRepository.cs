using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data.Repositories
{
    public class PermissionRepository : IPermissionRepository
    {

        private readonly DataContext _context;
        private readonly ILogger<PermissionRepository> _logger;

        public PermissionRepository(DataContext context, ILogger<PermissionRepository> logger)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context), "DataContext is null in PermissionRepository constructor");
            }

            _context = context;
            _logger = logger;
            _logger.LogInformation("PermissionRepository instantiated successfully with a valid DataContext.");
        }

        //public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
        //{
        //    return await _context.Permissions.Include(p=>p.Roles).ToListAsync();
        //}

        public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
        {
            return await _context.Permissions
                .Include(p => p.Roles)
                .ToListAsync();
        }

        public async Task<IEnumerable<Permission>> GetPermissionsByRoleIdAsync(int roleId)
        {
            var role = await _context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.RoleId == roleId);

            return role?.Permissions ?? Enumerable.Empty<Permission>();
        }

        public async Task AddPermissionToRoleAsync(int roleId, int permissionId)
        {
            var role = await _context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.RoleId == roleId);
            if (role == null)
                throw new Exception("Role not found");
            var permission = await _context.Permissions.FindAsync(permissionId);
            if (permission == null)
                throw new Exception("Permission not found");

            if (role.Permissions.Any(p => p.Id == permissionId))
                throw new Exception("Permission already assigned to this role");

            role.Permissions.Add(permission);
            await _context.SaveChangesAsync();
        }

        public async Task RemovePermissionFromRoleAsync(int roleId, int permissionId)
        {
            var role = await _context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.RoleId == roleId);
            if (role == null)
                throw new Exception("Role not found");
            var permission = await _context.Permissions.FindAsync(permissionId);
            if (permission == null)
                throw new Exception("Permission not found");
            if (!role.Permissions.Any(p => p.Id == permissionId))
                throw new Exception("Permission not assigned to this role");
            role.Permissions.Remove(permission);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> RoleHasPermissionAsync(int roleId, string permissionName)
        {
            var role = await _context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.RoleId == roleId);
            if (role == null)
                throw new Exception("Role not found");
            return role.Permissions.Any(p => p.Name == permissionName);
        }

        public async Task<Permission> AddPermissionAsync(string name, string description)
        {
            var permission = new Permission { Name = name, Description = description };
            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();
            return permission;
        }

        public async Task<Permission> GetPermissionByNameAsync(string name)
        {
            return await _context.Permissions.FirstOrDefaultAsync(p => p.Name == name);

        }

        public async Task<Role> GetRoleByNameAsync(string name)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == name);
        }

        public async Task<Permission> GetPermissionByIdAsync(int id)
        {
            return await _context.Permissions.FindAsync(id);
        }

        public async Task<Role> GetRoleByIdAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public async Task RemovePermissionAsync(Permission permission)
        {
            var permissionWithRoles = await _context.Permissions
            .Include(p => p.Roles)
            .FirstOrDefaultAsync(p => p.Id == permission.Id);

            if (permissionWithRoles != null)
            {
                permissionWithRoles.Roles.Clear();

                await _context.SaveChangesAsync();

                _context.Permissions.Remove(permissionWithRoles);
                await _context.SaveChangesAsync();
            }
        }

    }
}
