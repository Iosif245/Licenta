using ConnectCampus.Domain.Common.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Common;

[ApiController]
[Authorize]
public abstract class ApiController : ControllerBase
{
    protected IActionResult HandleFailure(Result result) =>
        result.Error.Type switch
        {
            ErrorType.Validation => BadRequest(CreateProblemDetails(
                "Validation Error",
                StatusCodes.Status400BadRequest,
                result.Error.Message,
                result.Error.ValidationDetails)),

            ErrorType.NotFound => NotFound(CreateProblemDetails(
                "Not Found",
                StatusCodes.Status404NotFound,
                result.Error.Message)),

            ErrorType.Conflict => Conflict(CreateProblemDetails(
                "Conflict",
                StatusCodes.Status409Conflict,
                result.Error.Message)),

            ErrorType.Unauthorized => Unauthorized(),

            ErrorType.Forbidden => Forbid(),
            
            ErrorType.ServiceUnavailable => StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                CreateProblemDetails(
                    "Service Unavailable",
                    StatusCodes.Status503ServiceUnavailable,
                    result.Error.Message)),

            _ => StatusCode(
                StatusCodes.Status500InternalServerError,
                CreateProblemDetails(
                    "Server Error",
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred"))
        };

    private static ProblemDetails CreateProblemDetails(
        string title,
        int status,
        string detail, 
        IReadOnlyCollection<ValidationDetail>? errors = null) 
    {
        var problemDetails = new ProblemDetails()
        {
            Title = title,
            Status = status,
            Detail = detail,
        };
        if (errors != null)
        {
            problemDetails.Extensions.Add("errors", errors);
        }
        
        return problemDetails;
    }
        
} 