using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Common.Time;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Users.RefreshTokens
{
    public class RefreshTokenCommandHandler : ICommandHandler<RefreshTokenCommand, RefreshTokenResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenerator _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDateTimeMachine _dateTime;

        public RefreshTokenCommandHandler(
            IUserRepository userRepository,
            IJwtTokenGenerator jwtService,
            IHttpContextAccessor httpContextAccessor, 
            IRefreshTokenRepository refreshTokenRepository, 
            IDateTimeMachine dateTime, 
            IUnitOfWork unitOfWork, 
            IRefreshTokenService refreshTokenService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
            _refreshTokenRepository = refreshTokenRepository;
            _dateTime = dateTime;
            _unitOfWork = unitOfWork;
            _refreshTokenService = refreshTokenService;
        }

        public async Task<Result<RefreshTokenResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var token = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(token))
            {
                return Result.Failure<RefreshTokenResponse>(ValidationErrors.Auth.RefreshTokenNotFound);
            }

            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(token, cancellationToken);
            if (refreshToken == null)
            {
                return Result.Failure<RefreshTokenResponse>(ValidationErrors.Auth.RefreshTokenNotFound);
            }

            if (refreshToken.ExpiresAt <= _dateTime.UtcNow)
            {
                return Result.Failure<RefreshTokenResponse>(ValidationErrors.Auth.TokenExpired);
            }
            
            var user = await _userRepository.GetByIdAsync(refreshToken.UserId, cancellationToken);
            if (user == null)
            {
                return Result.Failure<RefreshTokenResponse>(ValidationErrors.User.NotFound);
            }
            
            refreshToken.Update(_refreshTokenService.GenerateToken(), _refreshTokenService.GetExpiryTime(_dateTime.UtcNow));

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            var accessToken = _jwtService.GenerateToken(user);

            return Result.Success(new RefreshTokenResponse(
                accessToken,
                refreshToken.Token));
        }
    }
} 