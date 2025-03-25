using AutoMapper;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service
{
    public class MappingProfile : Profile
    {

        public MappingProfile()
        {
            CreateMap<RegisterUserDto, User>()
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

            CreateMap<User, LoginResult>()
              .ForMember(dest => dest.Roles, opt => opt.MapFrom(src =>
                src.UserRoles.Select(ur => ur.Role.RoleName).ToList()));

            CreateMap<ExpenseAndIncome, ExpenseRes>()
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : "Unknown"))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.Date))); // המרת DateTime ל-DateOnly

            CreateMap<CategoryExpenseAndIncome, string>().ConvertUsing(src => src.Name);

        }

    }
}

