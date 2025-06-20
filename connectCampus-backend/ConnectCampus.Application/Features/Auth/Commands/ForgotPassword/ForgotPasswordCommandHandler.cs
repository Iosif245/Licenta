using System;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Abstractions.Services;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Auth.Commands.ForgotPassword
{
    public class ForgotPasswordCommandHandler : ICommandHandler<ForgotPasswordCommand, bool>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        
        public ForgotPasswordCommandHandler(
            IUserRepository userRepository,
            IPasswordResetTokenRepository tokenRepository,
            IEmailService emailService,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<Result<bool>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            // Find the user by email
            var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            
            // Even if user is not found, return success to prevent email enumeration attacks
            if (user == null)
            {
                return Result.Success(true);
            }
            
            // Invalidate any existing tokens for this user
            await _tokenRepository.InvalidateAllTokensForUserAsync(user.Id, cancellationToken);
            
            // Generate a secure password reset token
            string resetToken = GenerateSecureToken();
            
            // Create and save the password reset token (expires in 24 hours)
            var passwordResetToken = new PasswordResetToken(
                user.Id,
                resetToken,
                DateTime.UtcNow.AddHours(24));
            
            _tokenRepository.Add(passwordResetToken);
            
            // Send the password reset email
            await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken);
            
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
        
        private static string GenerateSecureToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[32];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
    }
} 