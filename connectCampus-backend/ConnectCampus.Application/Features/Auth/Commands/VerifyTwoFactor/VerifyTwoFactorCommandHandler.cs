using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Features.Users.Login;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Auth.Commands.VerifyTwoFactor
{
    public class VerifyTwoFactorCommandHandler : ICommandHandler<VerifyTwoFactorCommand, LoginResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly ITwoFactorCodeRepository _twoFactorCodeRepository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDateTimeMachine _dateTime;

        public VerifyTwoFactorCommandHandler(
            IUserRepository userRepository,
            ITwoFactorCodeRepository twoFactorCodeRepository,
            IJwtTokenGenerator jwtTokenGenerator,
            IRefreshTokenService refreshTokenService,
            IRefreshTokenRepository refreshTokenRepository,
            IUnitOfWork unitOfWork,
            IDateTimeMachine dateTime)
        {
            _userRepository = userRepository;
            _twoFactorCodeRepository = twoFactorCodeRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _refreshTokenService = refreshTokenService;
            _refreshTokenRepository = refreshTokenRepository;
            _unitOfWork = unitOfWork;
            _dateTime = dateTime;
        }

        public async Task<Result<LoginResponse>> Handle(VerifyTwoFactorCommand request, CancellationToken cancellationToken)
        {
            // Parse user ID
            if (!Guid.TryParse(request.UserId, out var userId))
            {
                return Result.Failure<LoginResponse>(ValidationErrors.Auth.InvalidCredentials);
            }

            // Find the code
            var twoFactorCode = await _twoFactorCodeRepository.GetByCodeAsync(request.Code, cancellationToken);

            if (twoFactorCode == null || !twoFactorCode.IsValid() || twoFactorCode.UserId != userId)
            {
                return Result.Failure<LoginResponse>(ValidationErrors.Auth.InvalidTwoFactorCode);
            }

            // Get the user
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                return Result.Failure<LoginResponse>(ValidationErrors.User.NotFound);
            }

            // Mark the code as used
            twoFactorCode.MarkAsUsed();

            // Invalidate all other codes for this user
            await _twoFactorCodeRepository.InvalidateAllCodesForUserAsync(userId, cancellationToken);

            // Generate tokens
            var token = _jwtTokenGenerator.GenerateToken(user);
            var refreshToken = new RefreshToken(user.Id, _refreshTokenService.GenerateToken(), _refreshTokenService.GetExpiryTime(_dateTime.UtcNow));

            _refreshTokenRepository.Add(refreshToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var response = new LoginResponse(
                AccessToken: token,
                RefreshToken: refreshToken.Token,
                RequiresTwoFactor: false,
                UserId: user.Id.ToString());

            return Result.Success(response);
        }
    }
} 