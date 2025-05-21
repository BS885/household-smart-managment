using Amazon.Runtime.Internal.Util;
using AutoMapper;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<PermissionService> _logger;


        public PermissionService(IPermissionRepository permissionRepository, IMapper mapper, ILogger<PermissionService> logger)
        {
            _permissionRepository = permissionRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PermissionDto> AddPermissionAsync(string name, string description)
        {
            try
            {
                var existingPermission = await _permissionRepository.GetPermissionByNameAsync(name);
                if (existingPermission != null)
                {
                    _logger.LogWarning($"Permission with the name '{name}' already exists.");
                    throw new ApplicationException($"Permission with the name '{name}' already exists.");
                }

                var addedPermission = await _permissionRepository.AddPermissionAsync(name, description);
                _logger.LogInformation($"Permission {name} added successfully.");

                return _mapper.Map<PermissionDto>(addedPermission);
            }
            catch (ApplicationException ex)
            {

                _logger.LogWarning($"Custom error occurred: {ex.Message}");
                throw new ApplicationException($"Custom error: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                // במקרה של שגיאה כללית אחרת
                _logger.LogError($"An error occurred while adding the permission: {ex.Message}", ex);
                throw new ApplicationException("An unexpected error occurred while adding the permission.", ex);
            }
        }

        public async Task DeletePermissionAsync(int id)
        {
            try
            {
                var permission = await GetPermissionByIdAsync(id);

                if (permission == null)
                {
                    _logger.LogWarning($"Permission with ID {id} not found.");
                    return;
                }
                await _permissionRepository.RemovePermissionAsync(permission);
                _logger.LogInformation($"Permission with ID {id} deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while deleting the permission: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while deleting the permission.", ex);
            }
        }

        public async Task<IEnumerable<PermissionWithRolesDto>> GetAllPermissionsAsync()
        {
            try
            {
                var permissions = await _permissionRepository.GetAllPermissionsAsync();
                _logger.LogInformation($"Retrieved {permissions.Count()} permissions.");
                return _mapper.Map<IEnumerable<PermissionWithRolesDto>>(permissions);

            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while retrieving all permissions: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while retrieving all permissions.", ex);
            }
        }

        public async Task<Permission> GetPermissionByIdAsync(int id)
        {
            try
            {
                var permission = await _permissionRepository.GetPermissionByIdAsync(id);
                if (permission == null)
                {
                    _logger.LogWarning($"Permission with ID {id} not found.");
                    return null;
                }
                return permission;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while retrieving the permission: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while retrieving the permission.", ex);
            }
        }

        public async Task<IEnumerable<PermissionDto>> GetPermissionsByRoleIdAsync(int roleId)
        {
            try
            {
                var permissions = await _permissionRepository.GetPermissionsByRoleIdAsync(roleId);
                _logger.LogInformation($"Retrieved {permissions.Count()} permissions for role ID {roleId}.");

                return _mapper.Map<IEnumerable<PermissionDto>>(permissions);
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while retrieving permissions for role ID {roleId}: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while retrieving permissions for the role.", ex);
            }
        }

        public async Task AddPermissionToRoleAsync(string roleName, string permissionName)
        {
            try
            {
                var role = await _permissionRepository.GetRoleByNameAsync(roleName);
                var permission = await _permissionRepository.GetPermissionByNameAsync(permissionName);

                if (role == null || permission == null)
                {
                    _logger.LogWarning($"Role name {roleName} or Permission name {permissionName} not found.");
                    return;
                }

                await _permissionRepository.AddPermissionToRoleAsync(role.RoleId, permission.Id);

                _logger.LogInformation($"Added permission ID {permissionName} to role ID {roleName}.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while adding permission to role: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while adding permission to the role.", ex);
            }
        }

        public async Task RemovePermissionFromRoleAsync(string roleName, string permissionName)
        {
            try
            {
                var role = await GetRoleByNameAsync(roleName);
                var permission = await GetPermissionByNameAsync(permissionName);

                if (role == null || permission == null)
                {
                    _logger.LogWarning($"Role name {roleName} or Permission name {permissionName} not found.");
                    return;
                }
                await _permissionRepository.RemovePermissionFromRoleAsync(role.RoleId, permission.Id);
                _logger.LogInformation($"Removed permission ID {permission.Id} from role ID {role.RoleId}.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while removing permission from role: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while removing permission from the role.", ex);
            }
        }

        public async Task<bool> RoleHasPermissionAsync(int roleId, string permissionName)
        {
            try
            {
                var hasPermission = await _permissionRepository.RoleHasPermissionAsync(roleId, permissionName);
                _logger.LogInformation($"Role ID {roleId} has permission {permissionName}: {hasPermission}");
                return hasPermission;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while checking role permissions: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while checking role permissions.", ex);
            }
        }

        public async Task<Permission> GetPermissionByNameAsync(string name)
        {
            try
            {
                var permission = await _permissionRepository.GetPermissionByNameAsync(name);
                if (permission == null)
                {
                    _logger.LogWarning($"Permission with name {name} not found.");
                    return null;
                }
                return permission;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while retrieving the permission: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while retrieving the permission.", ex);
            }
        }

        public async Task<Role> GetRoleByNameAsync(string name)
        {
            try
            {
                var role = await _permissionRepository.GetRoleByNameAsync(name);
                if (role == null)
                {
                    _logger.LogWarning($"Role with name {name} not found.");
                    return null;
                }
                return role;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while retrieving the role: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while retrieving the role.", ex);
            }
        }

        public async Task<Role> GetRoleByIdAsync(int id)
        {
            try
            {
                var role = await _permissionRepository.GetRoleByIdAsync(id);
                if (role == null)
                {
                    _logger.LogWarning($"Role with ID {id} not found.");
                    return null;
                }
                return role;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while retrieving the role: {ex.Message}", ex);
                throw new ApplicationException("An error occurred while retrieving the role.", ex);
            }
        }
    }
}
