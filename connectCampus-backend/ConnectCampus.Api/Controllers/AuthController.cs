using System.Net.Mime;
using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Auth;
using ConnectCampus.Api.Models.Associations;
using ConnectCampus.Api.Models.Students;
using ConnectCampus.Application.Features.Users.Login;
using ConnectCampus.Application.Features.Users.RefreshTokens;
using ConnectCampus.Application.Features.Associations.Commands.RegisterAssociation;
using ConnectCampus.Application.Features.Students.Commands.RegisterStudent;
using ConnectCampus.Application.Features.Auth.Commands.ForgotPassword;
using ConnectCampus.Application.Features.Auth.Commands.ResetPassword;
using ConnectCampus.Application.Features.Auth.Commands.VerifyTwoFactor;
using ConnectCampus.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers;

/// <summary>
/// Handles user authentication operations
/// </summary>
[ApiController]
[Route("api/auth")]
[Produces(MediaTypeNames.Application.Json)]
public class AuthController : ApiController
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Registers a new student with complete profile
    /// </summary>
    /// <param name="request">The student registration information</param>
    /// <returns>Created response with student ID on success</returns>
    [HttpPost("register/student")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterStudent([FromForm] RegisterStudentRequest request)
    {
        // Parse education level from string to EducationLevel enumeration
        var educationLevel = EducationLevel.FromName(request.EducationLevel);
        if (educationLevel == null)
        {
            return BadRequest($"Invalid education level: {request.EducationLevel}");
        }

        var command = new RegisterStudentCommand(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.University,
            request.Faculty,
            request.Specialization,
            request.StudyYear,
            educationLevel,
            request.Avatar);

        var result = await _mediator.Send(command);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }
        
        return result.Match(
            studentId => Created($"api/students/{studentId}", new { id = studentId }),
            HandleFailure);
    }

    /// <summary>
    /// Registers a new association with complete profile
    /// </summary>
    /// <param name="request">The association registration information</param>
    /// <returns>Created response with association ID on success</returns>
    [HttpPost("register/association")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterAssociation([FromForm] RegisterAssociationRequest request)
    {
        var command = new RegisterAssociationCommand(
            request.Email,
            request.Password,
            request.Name,
            request.Description,
            request.Category,
            request.FoundedYear,
            request.Logo,
            request.CoverImage,
            request.Location,
            request.Website,
            request.Phone,
            request.Address,
            request.Facebook,
            request.Twitter,
            request.Instagram,
            request.LinkedIn);

        var result = await _mediator.Send(command);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }
        
        return result.Match(
            associationId => Created($"api/associations/{associationId}", new { id = associationId }),
            HandleFailure);
    }

    /// <summary>
    /// Authenticates a user and returns an access token or requires 2FA
    /// </summary>
    /// <param name="request">The login credentials</param>
    /// <returns>Access token on success or 2FA requirement</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(LoginUserRequest request)
    {
        var command = new LoginCommand(request.Email, request.Password);
        var result = await _mediator.Send(command);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }

        var response = result.Value;
        
        if (response.RequiresTwoFactor)
        {
            return Ok(new { 
                requiresTwoFactor = true, 
                userId = response.UserId,
                message = "Two-factor authentication code sent to your email" 
            });
        }
        
        HttpContext.Response.Cookies.Append("refreshToken", response.RefreshToken!, new CookieOptions { Expires = DateTimeOffset.UtcNow.AddDays(7) });

        return Ok(new { accessToken = response.AccessToken });
    }
    
    /// <summary>
    /// Verifies two-factor authentication code and completes login
    /// </summary>
    /// <param name="request">The verification details</param>
    /// <returns>Access token on successful verification</returns>
    [HttpPost("verify-2fa")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> VerifyTwoFactor(VerifyTwoFactorRequest request)
    {
        var command = new VerifyTwoFactorCommand(request.UserId, request.Code);
        var result = await _mediator.Send(command);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }

        var response = result.Value;
        
        HttpContext.Response.Cookies.Append("refreshToken", response.RefreshToken!, new CookieOptions { Expires = DateTimeOffset.UtcNow.AddDays(7) });

        return Ok(new { accessToken = response.AccessToken });
    }
    
    /// <summary>
    /// Refreshes an expired access token using a refresh token
    /// </summary>
    /// <returns>New access token on success</returns>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh()
    {
        var result = await _mediator.Send(new RefreshTokenCommand());

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }
        
        HttpContext.Response.Cookies.Append("refreshToken", result.Value.RefreshToken, new CookieOptions { Expires = DateTimeOffset.UtcNow.AddDays(7) });

        return Ok(new { accessToken = result.Value.AccessToken });
    }
    
    /// <summary>
    /// Logs out the current user by invalidating their refresh token
    /// </summary>
    /// <returns>Success response</returns>
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Logout()
    {
        HttpContext.Response.Cookies.Delete("refreshToken");

        return Ok();
    }

    /// <summary>
    /// Request a password reset email
    /// </summary>
    /// <param name="request">Email address</param>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        var command = new ForgotPasswordCommand(request.Email);
        var result = await _mediator.Send(command);
        
        // Always return success to prevent email enumeration attacks
        return Ok();
    }
    
    /// <summary>
    /// Reset password using token received via email
    /// </summary>
    /// <param name="request">Reset password details</param>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        var command = new ResetPasswordCommand(
            request.Token,
            request.NewPassword);
            
        var result = await _mediator.Send(command);
        
        return result.Match(
            success => Ok(),
            HandleFailure);
    }
}