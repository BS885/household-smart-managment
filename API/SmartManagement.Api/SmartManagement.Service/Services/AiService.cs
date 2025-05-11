using Amazon.Runtime;
using Microsoft.Extensions.Configuration;
using SmartManagement.Core.Repositories;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;


namespace SmartManagement.Service.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ICategoryService _categoryService;

        public AiService(IConfiguration configuration, ICategoryService categoryService)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["ApiSettings:ApiKey"];
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                Console.WriteLine("error  with ApiSettings:ApiKey");
                throw new ArgumentNullException(nameof(_apiKey));
            }
                _categoryService = categoryService;
        }

        public async Task<string> GetCategoryFromDescription(string description, string type)
        {
            var categoryList = await _categoryService.GetAllCategoriesListNameAsync(type);
            var url = "https://openrouter.ai/api/v1/chat/completions";

            var body = new
            {
                model = "tngtech/deepseek-r1t-chimera:free",
                messages = new[]
                {
                    new { role = "user", content = $"{description} This is a description of an {type}. Which category would best fit your needs? Answer in one word or two words in Hebrew from the following list and only from this list: {string.Join(", ", categoryList)}" }
                }
            };

            var requestJson = JsonSerializer.Serialize(body);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            try
            {
                var response = await _httpClient.PostAsync(url, content);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                return ExtractCleanContent(responseString);
            }
            catch (Exception ex)
            {
                // אפשר להוסיף כאן לוגים או טיפול שגיאות חכם
                throw new Exception($"Error communicating with OpenRouter API: {ex.Message}");
            }
        }

        private static string ExtractCleanContent(string jsonResponse)
        {
            var doc = JsonDocument.Parse(jsonResponse);

            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            content = content.Replace("\\n", "").Replace("\\", "").Trim();
            content = content.Trim().Trim('"');


            return content;
        }
    }



}


