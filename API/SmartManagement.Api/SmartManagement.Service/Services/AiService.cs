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
                    new {
                        role = "system",
                        content = "אתה עוזר קטלוג. ענה אך ורק בשם קטגוריה אחד או שניים מהרשימה הנתונה. אל תסביר, אל תוסיף כלום. החזר את שם הקטגוריה בלבד."
                    },
                     new { role = "user", content =
                        $"This is a description of an {type}: \"{description}\". " +
                        $"From the following list of Hebrew categories: {string.Join(", ", categoryList)} " +
                        $"— respond **only** with the most fitting category name from the list, " +
                        $"in Hebrew, without any explanation, and no more than two words. Return only the category name." }
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
                var responseLines = responseString.Split('\n');
                var lastLine = responseLines.LastOrDefault(line => !string.IsNullOrWhiteSpace(line));
                 lastLine?.Trim();
                string category = ExtractCleanContent(lastLine);
                Console.WriteLine("category after ExtractCleanContent " + category);
                return category;
            }
            catch (Exception ex)
            {
                // אפשר להוסיף כאן לוגים או טיפול שגיאות חכם
                throw new Exception($"Error communicating with OpenRouter API: {ex.Message}");
            }
        }

        private string ExtractCleanContent(string responseString)
        {
            using JsonDocument doc = JsonDocument.Parse(responseString);
            var root = doc.RootElement;

            var content = root
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            var lines = content.Split('\n')
                       .Where(l => !string.IsNullOrWhiteSpace(l))
                       .ToList();

            return lines.Last().Trim();
        }
    }
}


