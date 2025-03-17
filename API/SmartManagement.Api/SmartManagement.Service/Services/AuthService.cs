using AutoMapper;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;


namespace SmartManagement.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, IMapper mapper, ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public User Login(LoginRequest loginRequest)
        {
            User user = _userRepository.GetUserByEmail(loginRequest.Email);
            if (user != null && user.Password == loginRequest.Password && user.Name == loginRequest.UserName)
            {
                return user;
            }
            return null;
        }
        public User Register(RegisterUserDto userRegister)
        {
            if (userRegister == null)
                throw new ArgumentNullException(nameof(userRegister), "User cannot be null.");

            var existingUser = _userRepository.GetUserByEmail(userRegister.Email);
            if (existingUser != null)
            {
                _logger.LogError("A user with this email already exists: {Email}", userRegister.Email);
                throw new InvalidOperationException("A user with this email already exists.");
            }
            var user = _mapper.Map<User>(userRegister);
            _userRepository.AddUser(user);
            _logger.LogInformation("add user  {user}", user.UserId);
            return user;
        }
    }
}
