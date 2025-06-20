using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Users.Commands.UpdateUserPreferences
{
    public record UpdateUserPreferencesCommand(
        Guid UserId,
        bool IsTwoFactorEnabled,
        bool EventRemindersEnabled,
        bool MessageNotificationsEnabled,
        bool AssociationUpdatesEnabled,
        bool MarketingEmailsEnabled,
        string Theme) : ICommand<bool>;
} 