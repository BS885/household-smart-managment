using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.DTOs;
using System.Net.Mail;
using System.Net;
using System.Text;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : Controller
    {
        private readonly IEmailSenderService _emailSender;

        public ReportController(IEmailSenderService emailSender)
        {
            _emailSender = emailSender;
        }

        [HttpPost("send-report")]
        public async Task<IActionResult> SendReport([FromBody] SendReportDto dto)
        {
            var contentWithBom = "\uFEFF" + dto.Content;
            var attachmentBytes = Encoding.UTF8.GetBytes(contentWithBom);
            var subject = "דו״ח מערכת";
            var body = "מצורף הדו\"ח בפורמט CSV.";

            await _emailSender.SendEmailWithAttachmentAsync(dto.Email, subject, body, attachmentBytes, dto.Filename);

            return Ok("Email sent successfully");
        }

    }
}
