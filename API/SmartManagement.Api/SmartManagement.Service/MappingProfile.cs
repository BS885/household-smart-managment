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

            CreateMap<User, UserDto>().ReverseMap();


            CreateMap<ExpenseAndIncome, ExpenseRes>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.Date)))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description)) 
                .ForMember(dest => dest.Sum, opt => opt.MapFrom(src => src.Sum))
                .ForMember(dest => dest.FileType, opt => opt.MapFrom(src => src.TransactionDocument.FileType))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.TransactionDocument.FileName))
                .ForMember(dest => dest.Filesize, opt => opt.MapFrom(src => src.TransactionDocument != null ? FormatFileSize(src.TransactionDocument.Size) : null)); // מיפוי גודל הקובץ אם קיים

            CreateMap<CategoryExpenseAndIncome, string>().ConvertUsing(src => src.Name);

            CreateMap<FileDto, TransactionDocument>()
              .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.NameFile))
              .ForMember(dest => dest.FileType, opt => opt.MapFrom(src => src.TypeFile))
              .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
              .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));


            CreateMap<Permission, PermissionDto>().ReverseMap();

            CreateMap<Permission, PermissionWithRolesDto>()
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(r => r.RoleName)));
        }


        private static string FormatFileSize(long sizeInBytes)
        {
            if (sizeInBytes < 1024)
                return $"{sizeInBytes} B";
            else if (sizeInBytes < 1024 * 1024)
                return $"{(sizeInBytes / 1024.0):F1} KB";
            else if (sizeInBytes < 1024 * 1024 * 1024)
                return $"{(sizeInBytes / (1024.0 * 1024)):F1} MB";
            else
                return $"{(sizeInBytes / (1024.0 * 1024 * 1024)):F1} GB";
        }
    }

}