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

var awsOptions = builder.Configuration.GetSection("AWS");
string region = awsOptions["Region"] ?? "us-east-1";
string accessKeyId = awsOptions["AccessKey"];
string secretAccessKey = awsOptions["SecretKey"];

if (string.IsNullOrEmpty(accessKeyId) || string.IsNullOrEmpty(secretAccessKey))
{
    throw new InvalidOperationException("AWS credentials are missing from appsettings.json.");
}

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
    };

    var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
    return new AmazonS3Client(credentials, config);
});

builder.Services.AddSingleton<IAmazonTextract>(sp =>
{
    var config = new AmazonTextractConfig
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
    };

    var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
    return new AmazonTextractClient(credentials, config);
});
builder.Services.AddHttpClient();

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
builder.Services.AddScoped<IAiService, AiService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IPasswordResetTokensRepository, PasswordResetTokensRepository>();
builder.Services.AddScoped<IEmailSenderService, EmailSenderService>();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 41))));

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Logging.AddConsole();
builder.Logging.AddDebug();

//JWT
var jwtOptions = builder.Configuration.GetSection("JWT");
string issuer = jwtOptions["Issuer"] ?? throw new InvalidOperationException("Missing JWT Issuer");
string audience = jwtOptions["Audience"] ?? throw new InvalidOperationException("Missing JWT Audience");
string key = jwtOptions["Key"] ?? throw new InvalidOperationException("Missing JWT Key");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });


builder.Services.AddAuthorization(options =>
{
    AuthorizationPolicies.AddPolicies(options);
});


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://household-smart-managment.onrender.com", "http://localhost:4200"
            , "https://household-smart-managment-manage.onrender.com")
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
