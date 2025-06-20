using System;
using ConnectCampus.Application.Abstractions.Messaging;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Announcements.Commands.UpdateAnnouncement
{
    public record UpdateAnnouncementCommand(
        Guid Id,
        string Title,
        string Content,
        IFormFile? Image) : ICommand<bool>;
} 