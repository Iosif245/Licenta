using ConnectCampus.Domain.Common;

namespace ConnectCampus.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    
    bool IsAuthenticated { get; }
    
    UserRole? Role { get; }

    bool IsInRole(UserRole role);
} 