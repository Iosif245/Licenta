using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementComments
{
    public class GetAnnouncementCommentsQueryHandler : IQueryHandler<GetAnnouncementCommentsQuery, List<AnnouncementCommentDto>>
    {
        private readonly IAnnouncementCommentRepository _commentRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IAssociationRepository _associationRepository;

        public GetAnnouncementCommentsQueryHandler(
            IAnnouncementCommentRepository commentRepository,
            IStudentRepository studentRepository,
            IAssociationRepository associationRepository)
        {
            _commentRepository = commentRepository;
            _studentRepository = studentRepository;
            _associationRepository = associationRepository;
        }

        public async Task<Maybe<List<AnnouncementCommentDto>>> Handle(GetAnnouncementCommentsQuery request, CancellationToken cancellationToken)
        {
            var comments = await _commentRepository.GetByAnnouncementIdAsync(request.AnnouncementId, cancellationToken);
            
            var commentDtos = new List<AnnouncementCommentDto>();
            
            foreach (var comment in comments)
            {
                var commentDto = await MapToDtoAsync(comment, cancellationToken);
                commentDtos.Add(commentDto);
            }
            
            return commentDtos;
        }

        private async Task<AnnouncementCommentDto> MapToDtoAsync(AnnouncementComment comment, CancellationToken cancellationToken)
        {
            string authorName = "Unknown Author";
            string? authorAvatarUrl = null;
            
            // Fetch author information based on AuthorType
            if (comment.AuthorType == AuthorType.Student)
            {
                var student = await _studentRepository.GetByIdAsync(comment.AuthorId, cancellationToken);
                if (student != null)
                {
                    authorName = $"{student.FirstName} {student.LastName}";
                    authorAvatarUrl = student.AvatarUrl;
                }
            }
            else if (comment.AuthorType == AuthorType.Association)
            {
                var association = await _associationRepository.GetByIdAsync(comment.AuthorId, cancellationToken);
                if (association != null)
                {
                    authorName = association.Name;
                    authorAvatarUrl = association.Logo;
                }
            }
            
            // Map replies recursively
            var replies = new List<AnnouncementCommentDto>();
            foreach (var reply in comment.Replies)
            {
                var replyDto = await MapToDtoAsync(reply, cancellationToken);
                replies.Add(replyDto);
            }
            
            return new AnnouncementCommentDto(
                comment.Id,
                comment.AnnouncementId,
                comment.AuthorId,
                comment.AuthorType,
                authorName,
                authorAvatarUrl,
                comment.Content,
                comment.CreatedAt,
                comment.UpdatedAt,
                comment.ParentCommentId,
                replies
            );
        }
    }
} 
 
 