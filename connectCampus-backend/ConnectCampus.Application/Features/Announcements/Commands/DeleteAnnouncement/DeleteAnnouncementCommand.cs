using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Announcements.Commands.DeleteAnnouncement
{
    public record DeleteAnnouncementCommand(Guid Id) : ICommand<bool>;
} 