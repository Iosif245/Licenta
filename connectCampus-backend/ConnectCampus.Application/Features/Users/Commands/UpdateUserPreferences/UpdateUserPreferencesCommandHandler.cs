using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Users.Commands.UpdateUserPreferences
{
    public class UpdateUserPreferencesCommandHandler : ICommandHandler<UpdateUserPreferencesCommand, bool>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateUserPreferencesCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(UpdateUserPreferencesCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

            if (user == null)
            {
                return Result.Failure<bool>(ValidationErrors.User.NotFound);
            }

            // Get theme from string value
            var theme = Theme.FromName(request.Theme) ?? Theme.System;

            // Update two-factor settings
            user.SetTwoFactorEnabled(request.IsTwoFactorEnabled, DateTime.UtcNow);
            
            // Update notification preferences
            user.UpdateNotificationPreferences(
                request.EventRemindersEnabled,
                request.MessageNotificationsEnabled,
                request.AssociationUpdatesEnabled,
                request.MarketingEmailsEnabled,
                DateTime.UtcNow);
                
            // Update theme
            user.UpdateTheme(theme, DateTime.UtcNow);

            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 