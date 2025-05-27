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
using SmartManagement.Core.Exceptios;


namespace SmartManagement.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IPasswordResetTokensRepository _passwordResetTokensRepository;
        private readonly IEmailSenderService _emailSender;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;
        private readonly IConfiguration _configuration;
        private readonly string _resetPasswordUrl;

        public AuthService(IUserRepository userRepository, IMapper mapper, ILogger<AuthService> logger, IConfiguration configuration, IRoleRepository roleRepository,IPasswordResetTokensRepository passwordResetTokensRepository, IEmailSenderService emailSender)
        {
            _userRepository = userRepository;
            _emailSender = emailSender;
            _passwordResetTokensRepository = passwordResetTokensRepository;
            _mapper = mapper;
            _logger = logger;
            _configuration = configuration;
            _roleRepository = roleRepository;
            _resetPasswordUrl = configuration["FRONTED:ResetPasswordUrl"] ?? throw new InvalidOperationException("ResetPasswordUrl is missing in configuration.");

        }

        public async Task<LoginResult>  Login(LoginRequest loginRequest)
        {
            User user = await _userRepository.GetUserByEmailAsync(loginRequest.Email);

            if (user != null && user.Password == loginRequest.Password)
            {
                var loginResult = _mapper.Map<LoginResult>(user);
                loginResult.Token = GenerateJwtToken(user);
                _userRepository.UpdateUserLogin(user);
                return loginResult;
            }
            if (user == null)
            {
                _logger.LogWarning("unKnown user: {Email}", loginRequest.Email);
                throw new UserNotFoundException("unKnown user: " + loginRequest.Email);
            }
            else
                _logger.LogWarning("Login failed for user: {Email}", loginRequest.Email);
            return null;
        }

        public async Task<User> Register(RegisterUserDto userRegister)
        {
            if (userRegister == null)
                throw new ArgumentNullException(nameof(userRegister), "User cannot be null.");

            // בדיקה אם המשתמש כבר קיים
            var existingUser =await  _userRepository.GetUserByEmailAsync(userRegister.Email);
            if (existingUser != null)
            {
                _logger.LogError("A user with this email already exists: {Email}", userRegister.Email);
                throw new InvalidOperationException("A user with this email already exists.");
            }

            var roleName = string.IsNullOrEmpty(userRegister.RoleName) ? "User" : userRegister.RoleName;
            _logger.LogInformation("Registering user with Role {RoleName}", roleName);

            // קבלת האובייקט Role מהמסד נתונים במקום יצירת אובייקט חדש
            var role = _roleRepository.GetRoleByName(roleName);
            if (role == null)
            {
                throw new InvalidOperationException($"Role '{roleName}' does not exist.");
            }

            // מיפוי ה-DTO לאובייקט User
            var user = _mapper.Map<User>(userRegister);

            // שיוך ה-Role הקיים למשתמש (במקום ליצור חדש)
            user.Roles = new List<Role> { role };

            // שמירת המשתמש במסד הנתונים
            _userRepository.AddUser(user);
            _logger.LogInformation("Added user with ID {UserId} and Role {RoleName}", user.UserId, roleName);

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
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.RoleName));
            }

            // הוספת הרשאות כ-Claims
            var permissions = user.Roles
                .SelectMany(ur => ur.Permissions)
                .Select(rp => rp.Name)
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

        public async Task ForgotPassword(ForgotPasswordRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user != null)
            {



                var token = Guid.NewGuid().ToString();
                var expiry = DateTime.UtcNow.AddHours(1);


                await _passwordResetTokensRepository.AddTokenAsync(request.Email, token, expiry);
                var link = $"{_resetPasswordUrl}?token={token}";
                _logger.LogInformation("Generated password reset link: {Link} ", link);
                await _emailSender.SendEmailAsync(
                    user.Email,
                    "איפוס סיסמה",
                    $"לחץ כאן כדי לאפס את הסיסמה: <a href='{link}'>לאיפוס</a>"
                );
            }

        }

        public async Task ResetPassword(ResetPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.NewPassword))
            {
                throw new ArgumentException("Email, Token, and NewPassword are required.");
            }
            var token = await _passwordResetTokensRepository.GetTokenAsync(request.Token);

            if (token == null || token.Email != request.Email)
            {
                throw new InvalidOperationException("Invalid or expired password reset token.");
            }
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                throw new UserNotFoundException("User not found.");
            }
            user.Password = request.NewPassword;
            await _userRepository.UpdateUserAsync(user);
            await _passwordResetTokensRepository.RemoveTokenAsync(token.Token);
        }

    }
}
