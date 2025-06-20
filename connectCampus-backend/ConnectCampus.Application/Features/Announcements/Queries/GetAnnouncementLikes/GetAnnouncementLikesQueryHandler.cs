using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementLikes
{
    public class GetAnnouncementLikesQueryHandler : IQueryHandler<GetAnnouncementLikesQuery, List<AnnouncementLikeDto>>
    {
        private readonly IAnnouncementLikeRepository _likeRepository;

        public GetAnnouncementLikesQueryHandler(IAnnouncementLikeRepository likeRepository)
        {
            _likeRepository = likeRepository;
        }

        public async Task<Maybe<List<AnnouncementLikeDto>>> Handle(GetAnnouncementLikesQuery request, CancellationToken cancellationToken)
        {
            var likes = await _likeRepository.GetLikesByAnnouncementAsync(request.AnnouncementId, cancellationToken);

            var likeDtos = likes.Select(like =>
            {
                var authorName = like.Student != null
                    ? $"{like.Student.FirstName} {like.Student.LastName}"
                    : like.Association?.Name ?? "Unknown Author";

                return new AnnouncementLikeDto(
                    like.Id,
                    like.AnnouncementId,
                    like.AuthorId,
                    like.AuthorType,
                    authorName,
                    like.CreatedAt
                );
            }).ToList();

            return likeDtos;
        }
    }
} 
 
 