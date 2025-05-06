using Microsoft.AspNetCore.Authorization;
using SmartManagement.Core.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service.Services
{
    public class AuthorizationPolicies
    {
        public static void AddPolicies(AuthorizationOptions options)
        {
            options.AddPolicy("Roles.Permission", policy =>
                policy.Requirements.Add(new PermissionRequirement("Roles.Permission")));

            options.AddPolicy("Users.UpdateRole", policy =>
                policy.Requirements.Add(new PermissionRequirement("Users.UpdateRole")));

            options.AddPolicy("Users.Create", policy =>
                policy.Requirements.Add(new PermissionRequirement("Users.Create")));

            options.AddPolicy("Users.Delete", policy =>    
                policy.Requirements.Add(new PermissionRequirement("Users.Delete")));

            options.AddPolicy("Users.Update", policy =>
                policy.Requirements.Add(new PermissionRequirement("Users.Update")));

            options.AddPolicy("Users.AddAdmin", policy =>
                policy.Requirements.Add(new PermissionRequirement("Users.AddAdmin")));
        }
    }
}
