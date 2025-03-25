using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartManagement.Data;
using Pomelo.EntityFrameworkCore.MySql;
using System;
using SmartManagement.Core.services;
using SmartManagement.Service.Services;
using SmartManagement.Core.Repositories;
using SmartManagement.Data.Repositories;
using SmartManagement.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Amazon.S3;
using SmartManagement.Service.services;
using SmartManagement.Core.Security;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITransactionDocumentService, TransactionDocumentService>();
builder.Services.AddScoped<Is3Service, S3Service>();
builder.Services.AddScoped<ITransactionDocumentRepository, TransactionDocumentRepository>();
builder.Services.AddScoped<ITransactionDocumentService, TransactionDocumentService>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<IExpenseService, ExpenseService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseMySql(builder.Configuration["ConnectionStrings:DefaultConnection"],
//        new MySqlServerVersion(new Version(8, 0, 41))));

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 41))));



builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidIssuer = builder.Configuration["JWT:Issuer"],
                ValidAudience = builder.Configuration["JWT:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
            };
        });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Users.Update", policy =>
    policy.RequireClaim("Permission", "Users.Update"));

    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
});


//builder.Services.AddAuthorization();

builder.Services.AddAWSService<IAmazonS3>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://household-smart-managment.onrender.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");


app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5014";

app.Run();
