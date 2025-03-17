using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private readonly Is3Service _s3Service;


        public FileController(Is3Service s3Server)
        {
            _s3Service = s3Server;
        }

    }
}
