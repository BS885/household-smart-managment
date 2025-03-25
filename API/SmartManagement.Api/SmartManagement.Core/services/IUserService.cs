using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IUserService
    {
        void UpdateUser(int id, string name, string address, string city, string phone);
        string GetUserIdFromToken(ClaimsPrincipal user);

    }
}
