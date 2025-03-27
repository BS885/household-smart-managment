using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Models;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private readonly ITransactionDocumentService _transactionDocumentService;

        public FileController(ITransactionDocumentService transactionDocumentService)
        {
            _transactionDocumentService = transactionDocumentService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionDocumentByIdAsync(int id)
        {
            try
            {
                var document = await _transactionDocumentService.GetTransactionDocumentByIdAsync(id);
                if (document == null)
                {
                    return NotFound($"Transaction document with ID {id} not found.");
                }
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving transaction document: {ex.Message}");
            }
        }

        //[HttpGet("transaction/{transactionId}")]
        //public async Task<IActionResult> GetTransactionDocumentByTransactionIdAsync(int transactionId)
        //{
        //    try
        //    {
        //        var document = await _transactionDocumentService.GetTransactionDocumentByTransactionIdAsync(transactionId);
        //        if (document == null)
        //        {
        //            return NotFound($"Transaction document for transaction ID {transactionId} not found.");
        //        }
        //        return Ok(document);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error retrieving transaction document for transaction ID {transactionId}: {ex.Message}");
        //    }
        //}

        [HttpPost]
        public async Task<IActionResult> AddTransactionDocumentAsync([FromBody] FileDto transactionDocument)
        {
            try
            {
                await _transactionDocumentService.AddTransactionDocumentAsync(transactionDocument);
                return CreatedAtAction(nameof(GetTransactionDocumentByIdAsync), transactionDocument);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding transaction document: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransactionDocumentAsync(int id, [FromBody] TransactionDocument transactionDocument)
        {
            if (id != transactionDocument.Id)
            {
                return BadRequest("Transaction document ID mismatch.");
            }

            try
            {
                await _transactionDocumentService.UpdateTransactionDocumentAsync(transactionDocument);
                return Ok("Successful update"); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating transaction document: {ex.Message}");
            }
        }

        // Endpoint to delete a transaction document (soft delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransactionDocumentAsync(int id)
        {
            try
            {
                await _transactionDocumentService.DeleteTransactionDocumentAsync(id);
                return NoContent();  // Successful deletion, no content to return
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting transaction document: {ex.Message}");
            }
        }
    }
}
