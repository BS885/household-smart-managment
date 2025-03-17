using Microsoft.Extensions.Logging;
using SmartManagement.Core.Exceptios;
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

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
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
            return user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
