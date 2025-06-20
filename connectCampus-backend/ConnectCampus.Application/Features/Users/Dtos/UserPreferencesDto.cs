using System;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Users.Dtos
{
    public record UserPreferencesDto(
        bool IsTwoFactorEnabled,
        bool EventRemindersEnabled,
        bool MessageNotificationsEnabled,
        bool AssociationUpdatesEnabled,
        bool MarketingEmailsEnabled,
        string Theme);
} 