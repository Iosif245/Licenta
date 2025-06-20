using System.Security.Claims;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Common;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public UserRole? Role => UserRole.FromName(_httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role));
    public bool IsInRole(UserRole role) => IsAuthenticated && Role?.Value == role.Value;

    public Guid? UserId
    {
        get
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }
    }

    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false;
} 