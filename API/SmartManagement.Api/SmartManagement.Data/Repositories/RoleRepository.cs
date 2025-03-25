using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly DataContext _context;

        public RoleRepository(DataContext context)
        {
            _context = context;
        }

        public Role GetRoleByName(string roleName)
        {
            return _context.Roles.FirstOrDefault(r => r.RoleName == roleName);
        }
    }
}
