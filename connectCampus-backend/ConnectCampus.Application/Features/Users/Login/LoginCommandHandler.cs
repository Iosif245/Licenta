using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Abstractions.Services;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Domain.Entities;
using System.Security.Cryptography;

namespace ConnectCampus.Application.Features.Users.Login
{
    public class LoginCommandHandler : ICommandHandler<LoginCommand, LoginResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly ITwoFactorCodeRepository _twoFactorCodeRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDateTimeMachine _dateTime;

        public LoginCommandHandler(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator, 
            IRefreshTokenService refreshTokenService, 
            IRefreshTokenRepository refreshTokenRepository,
            ITwoFactorCodeRepository twoFactorCodeRepository,
            IEmailService emailService,
            IUnitOfWork unitOfWork, 
            IDateTimeMachine dateTime)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
            _refreshTokenService = refreshTokenService;
            _refreshTokenRepository = refreshTokenRepository;
            _twoFactorCodeRepository = twoFactorCodeRepository;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
            _dateTime = dateTime;
        }

        public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

            if (user == null)
            {
                return Result.Failure<LoginResponse>(ValidationErrors.Auth.InvalidCredentials);
            }

            if (!_passwordHasher.VerifyPassword(user.PasswordHash, request.Password))
            {
                return Result.Failure<LoginResponse>(ValidationErrors.Auth.InvalidCredentials);
            }

            // Check if two-factor authentication is enabled
            if (user.IsTwoFactorEnabled)
            {
                // Invalidate any existing codes for this user
                await _twoFactorCodeRepository.InvalidateAllCodesForUserAsync(user.Id, cancellationToken);
                
                // Generate a 6-digit code
                var twoFactorCode = GenerateSixDigitCode();
                
                // Create and save the two-factor code (expires in 10 minutes)
                var codeEntity = new TwoFactorCode(
                    user.Id,
                    twoFactorCode,
                    _dateTime.UtcNow.AddMinutes(10));
                
                _twoFactorCodeRepository.Add(codeEntity);
                
                // Send the code via email
                await _emailService.SendTwoFactorCodeAsync(user.Email, twoFactorCode);
                
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                
                // Return response indicating 2FA is required
                var twoFactorResponse = new LoginResponse(
                    AccessToken: null,
                    RefreshToken: null,
                    RequiresTwoFactor: true,
                    UserId: user.Id.ToString());

                return Result.Success(twoFactorResponse);
            }

            // Standard login flow (no 2FA)
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
        
        private static string GenerateSixDigitCode()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var randomNumber = BitConverter.ToUInt32(bytes, 0);
            return (randomNumber % 1000000).ToString("D6");
        }
    }
} 