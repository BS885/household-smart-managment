using Microsoft.Extensions.Logging;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Exceptios;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;
        private readonly IPermissionService _permissionService;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger, IPermissionService permissionService)
        {
            _userRepository = userRepository;
            _logger = logger;
            _permissionService = permissionService;
        }
        
        public void UpdateUser(int id, string name, string address, string city, string phone)
        {
            var user = _userRepository.GetUserById(id);
            if (user == null)
            {
                _logger.LogError($"User not found {id}");
                throw new UserNotFoundException("User not found");
            }

            user.Name=name;
            user.Address = address;
            user.City = city;
            user.Phone = phone;

            _logger.LogInformation($"user update: id {user.UserId} to {user}");
            _userRepository.UpdateUser(user);
        }

        public string GetUserIdFromToken(ClaimsPrincipal user)
        {
            if (user == null)
            {

                _logger.LogError("User is null");
                throw new ArgumentNullException(nameof(user));
            }
            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogError("User ID claim not found");
                throw new InvalidOperationException("User ID claim not found");
            }
            return userIdClaim.Value;
        }


        public async Task<User> UpdateRoleToUserAsync(UpdateUserRoleDto updateUser)
        {
            var user = await _userRepository.GetUserByEmailAsync(updateUser.UserEmail);
            if (user == null)
            {
                _logger.LogError($"User not found: {updateUser.UserEmail}");
                throw new UserNotFoundException("User not found");
            }

            var role = await _permissionService.GetRoleByNameAsync(updateUser.RoleName);
            if (role == null)
            {
                _logger.LogError($"Role not found: {updateUser.RoleName}");
                throw new Exception("Role not found");
            }

            user.Roles.Clear();

            user.Roles.Add(role);

            _userRepository.UpdateUser(user);

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            try
            {
                var users = await _userRepository.GetUsers();
                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get users");
                return Enumerable.Empty<User>();
            }
        }




    }
}
