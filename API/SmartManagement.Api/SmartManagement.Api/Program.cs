//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Options;
//using SmartManagement.Data;
//using Pomelo.EntityFrameworkCore.MySql;
//using System;
//using SmartManagement.Core.services;
//using SmartManagement.Service.Services;
//using SmartManagement.Core.Repositories;
//using SmartManagement.Data.Repositories;
//using SmartManagement.Service;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;
//using Amazon.S3;
//using SmartManagement.Service.services;
//using SmartManagement.Core.Security;
//using Microsoft.AspNetCore.Authorization;
//using Amazon.Runtime;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.DependencyInjection;
//using Amazon;
//using Amazon.Textract;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.

//builder.Services.AddControllers();
//// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IUserService, UserService>();
//builder.Services.AddScoped<IUserRepository, UserRepository>();
//builder.Services.AddScoped<ITransactionDocumentService, TransactionDocumentService>();
//builder.Services.AddScoped<Is3Service, S3Service>();
//builder.Services.AddScoped<ITransactionDocumentRepository, TransactionDocumentRepository>();
//builder.Services.AddScoped<ITransactionDocumentService, TransactionDocumentService>();
//builder.Services.AddScoped<IExpenseAndIncomeRepository, ExpenseAndIncomeRepository>();
//builder.Services.AddScoped<IExpenseAndIncomeService, ExpenseAndIncomeService>();
//builder.Services.AddScoped<IRoleRepository, RoleRepository>();
//builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();
//builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
//builder.Services.AddScoped<ICategoryService, CategoryService>();
//builder.Services.AddAWSService<IAmazonTextract>();


//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
//    new MySqlServerVersion(new Version(8, 0, 41))));

//builder.Services.AddAutoMapper(typeof(MappingProfile));

//builder.Logging.AddConsole();
//builder.Logging.AddDebug();

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//        .AddJwtBearer(options =>
//        {
//            options.TokenValidationParameters = new TokenValidationParameters
//            {
//                ValidateIssuer = true,
//                ValidateAudience = true,
//                ValidateLifetime = true,
//                ValidIssuer = builder.Configuration["JWT:Issuer"],
//                ValidAudience = builder.Configuration["JWT:Audience"],
//                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
//            };
//        });

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin", policy =>
//    {
//        policy.WithOrigins("http://localhost:5173", "https://household-smart-managment.onrender.com")
//              .AllowAnyMethod()
//              .AllowAnyHeader();
//    });
//});
////builder.Services.AddAuthorization();

//builder.Services.AddAWSService<IAmazonS3>();

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin", policy =>
//    {
//        policy.WithOrigins("http://localhost:5173", "https://household-smart-managment.onrender.com")
//              .AllowAnyMethod()
//              .AllowAnyHeader();
//    });
//});

//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
//    });



//var awsOptions = builder.Configuration.GetSection("AWS");
//string region = awsOptions["Region"] ?? "us-east-1";
//string accessKeyId = awsOptions["AccessKey"];
//string secretAccessKey = awsOptions["SecretKey"];

//if (string.IsNullOrEmpty(accessKeyId) || string.IsNullOrEmpty(secretAccessKey))
//{
//        throw new InvalidOperationException("AWS credentials are missing from appsettings.json.");
//}

//builder.Services.AddSingleton<IAmazonS3>(sp =>
//{
//    var options = new AmazonS3Config
//    {
//        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
//    };

//    var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
//    return new AmazonS3Client(credentials, options);
//});

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.MapOpenApi();
//}


//app.UseHttpsRedirection();

//app.UseCors("AllowSpecificOrigin");

//app.UseAuthentication();

//app.UseAuthorization();

//app.MapControllers();


//app.Run();
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
using Amazon.Runtime;
using Amazon;
using Amazon.Textract;

var builder = WebApplication.CreateBuilder(args);

// קריאת הגדרות AWS
var awsOptions = builder.Configuration.GetSection("AWS");
string region = awsOptions["Region"] ?? "us-east-1";
string accessKeyId = awsOptions["AccessKey"];
string secretAccessKey = awsOptions["SecretKey"];

if (string.IsNullOrEmpty(accessKeyId) || string.IsNullOrEmpty(secretAccessKey))
{
    throw new InvalidOperationException("AWS credentials are missing from appsettings.json.");
}

// הגדרת IAmazonS3 עם credentials
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
    };

    var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
    return new AmazonS3Client(credentials, config);
});

// הגדרת IAmazonTextract עם credentials
builder.Services.AddSingleton<IAmazonTextract>(sp =>
{
    var config = new AmazonTextractConfig
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
    };

    var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
    return new AmazonTextractClient(credentials, config);
});

// רישום שירותים פנימיים
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITransactionDocumentService, TransactionDocumentService>();
builder.Services.AddScoped<Is3Service, S3Service>();
builder.Services.AddScoped<ITransactionDocumentRepository, TransactionDocumentRepository>();
builder.Services.AddScoped<IExpenseAndIncomeRepository, ExpenseAndIncomeRepository>();
builder.Services.AddScoped<IExpenseAndIncomeService, ExpenseAndIncomeService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

// הגדרת EF Core
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 41))));

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// לוגים
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// JWT
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

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://household-smart-managment.onrender.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// JSON config
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// PIPELINE
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
