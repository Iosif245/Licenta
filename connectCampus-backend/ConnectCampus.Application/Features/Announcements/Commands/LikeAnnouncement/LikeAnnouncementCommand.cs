using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Commands.LikeAnnouncement
{
    public record LikeAnnouncementCommand(
        Guid AnnouncementId,
        Guid AuthorId,
        AuthorType AuthorType) : ICommand<bool>;
} 