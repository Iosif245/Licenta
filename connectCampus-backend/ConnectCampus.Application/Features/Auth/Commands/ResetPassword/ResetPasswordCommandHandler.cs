using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Abstractions.Services;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Auth.Commands.ResetPassword
{
    public class ResetPasswordCommandHandler : ICommandHandler<ResetPasswordCommand, bool>
    {
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IEmailService _emailService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IUnitOfWork _unitOfWork;
        
        public ResetPasswordCommandHandler(
            IPasswordResetTokenRepository tokenRepository,
            IEmailService emailService,
            IPasswordHasher passwordHasher,
            IUnitOfWork unitOfWork)
        {
            _tokenRepository = tokenRepository;
            _emailService = emailService;
            _passwordHasher = passwordHasher;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<Result<bool>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            // Find the token
            var resetToken = await _tokenRepository.GetByTokenAsync(request.Token, cancellationToken);
            
            if (resetToken == null || !resetToken.IsValid())
            {
                return Result.Failure<bool>(ValidationErrors.Auth.InvalidCredentials);
            }
            
            // Hash the new password before updating
            var hashedPassword = _passwordHasher.HashPassword(request.NewPassword);
            
            // Update the password
            resetToken.User.UpdatePassword(hashedPassword, DateTime.UtcNow);
            
            // Mark the token as used
            resetToken.MarkAsUsed();
            
            // Invalidate all other tokens for this user
            await _tokenRepository.InvalidateAllTokensForUserAsync(resetToken.UserId, cancellationToken);
            
            // Send password changed notification
            await _emailService.SendPasswordChangedNotificationAsync(
                resetToken.User.Email, 
                resetToken.User.Email); // Using email as username for now
            
            // Save changes
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 