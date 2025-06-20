using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Common.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
} 