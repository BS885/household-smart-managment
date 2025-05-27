using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IAuthService
    {
        Task<LoginResult> Login(LoginRequest loginRequest);
        Task<User> Register(RegisterUserDto userRegister);
        string GenerateJwtToken(User user);
        Task ForgotPassword(ForgotPasswordRequest forgotPasswordRequest);
        Task ResetPassword(ResetPasswordRequest request);
    }
}
