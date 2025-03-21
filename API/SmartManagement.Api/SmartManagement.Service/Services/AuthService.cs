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
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;


namespace SmartManagement.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IMapper mapper, ILogger<AuthService> logger, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
            _configuration = configuration;
        }

        public string Login(LoginRequest loginRequest)
        {
            User user = _userRepository.GetUserByEmail(loginRequest.Email);
            if (user != null && user.Password == loginRequest.Password && user.Name == loginRequest.Name)
            {
                return GenerateJwtToken(user);
            }
            _logger.LogWarning("Login failed for user: {Email}", loginRequest.Email);
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

        public string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
            };

            // הוספת תפקידים כ-Claims
            foreach (var role in user.UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Role.RoleName));
            }

            // הוספת הרשאות כ-Claims
            var permissions = user.UserRoles
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Name)
                .Distinct();

            foreach (var permission in permissions)
            {
                claims.Add(new Claim("Permission", permission));
            }

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

    }
}
