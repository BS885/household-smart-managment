using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.UI.Services;
using SmartManagement.Core.services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace SmartManagement.Service.Services
{
    public class EmailSenderService : IEmailSenderService
    {
        private readonly string _email;
        private readonly string _password;
        private readonly ILogger<EmailSenderService> _logger;
        public EmailSenderService(IConfiguration configuration, ILogger<EmailSenderService> logger)
        {
            _email = configuration["EMAIL:Email"] ?? throw new InvalidOperationException("Email is missing in configuration.");
            _password = configuration["EMAIL:Password"] ?? throw new InvalidOperationException("Password in mail is missing in configuration.");
            _logger = logger;

        }

        public async Task SendEmailAsync(string toEmail, string subject, string bodyHtml)
        {
            var message = new MailMessage(_email, toEmail, subject, bodyHtml);
            message.IsBodyHtml = true;

            using var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(_email, _password),
                EnableSsl = true
            };

            await smtp.SendMailAsync(message);
        }

        public async Task SendEmailWithAttachmentAsync(string toEmail, string subject, string bodyHtml, byte[] fileBytes, string fileName)
        {
            _logger.LogInformation("Sending email with attachment to {ToEmail} with subject {Subject}", toEmail, subject);
            var message = new MailMessage(_email, toEmail, subject, bodyHtml);
            message.IsBodyHtml = true;

            using var stream = new MemoryStream(fileBytes);
            var attachment = new Attachment(stream, fileName, "text/csv");
            message.Attachments.Add(attachment);

            using var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(_email, _password),
                EnableSsl = true
            };

            await smtp.SendMailAsync(message);
        }
    }
}
