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
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow));


            CreateMap<User, LoginResult>()
                 .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(r => r.RoleName).ToList()));



            CreateMap<ExpenseAndIncome, ExpenseRes>()
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : "Unknown"))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.Date)));

            CreateMap<CategoryExpenseAndIncome, string>().ConvertUsing(src => src.Name);

            CreateMap<FileDto, TransactionDocument>()
              .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.NameFile))
              .ForMember(dest => dest.FileType, opt => opt.MapFrom(src => src.TypeFile))
              .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
              .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow)).ReverseMap();

        }

    }
}

