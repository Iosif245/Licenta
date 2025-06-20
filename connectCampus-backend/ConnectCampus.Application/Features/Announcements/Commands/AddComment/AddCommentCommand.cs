using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Commands.AddComment
{
    public record AddCommentCommand(
        Guid AnnouncementId,
        Guid AuthorId,
        AuthorType AuthorType,
        string Content,
        Guid? ParentCommentId = null) : ICommand<Guid>;
} 