using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Common.Interfaces;

public interface IRefreshTokenService
{
    string GenerateToken();
    DateTime GetExpiryTime(DateTime utcNow);
}
