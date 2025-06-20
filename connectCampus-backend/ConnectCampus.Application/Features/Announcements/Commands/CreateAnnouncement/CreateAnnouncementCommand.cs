using System;
using ConnectCampus.Application.Abstractions.Messaging;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Announcements.Commands.CreateAnnouncement
{
    public record CreateAnnouncementCommand(
        Guid AssociationId,
        string Title,
        string Content,
        IFormFile? Image,
        Guid? EventId) : ICommand<Guid>;
} 