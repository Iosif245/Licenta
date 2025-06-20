using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Follows.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Application.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Follows.Queries.GetFollowers
{
    public class GetFollowersQueryHandler : IQueryHandler<GetFollowersQuery, List<FollowDto>>
    {
        private readonly IFollowRepository _followRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IDbContext _context;

        public GetFollowersQueryHandler(
            IFollowRepository followRepository,
            IAssociationRepository associationRepository,
            IDbContext context)
        {
            _followRepository = followRepository;
            _associationRepository = associationRepository;
            _context = context;
        }

        public async Task<Maybe<List<FollowDto>>> Handle(GetFollowersQuery request, CancellationToken cancellationToken)
        {
            // Check if the association exists
            var association = await _associationRepository.GetByIdAsync(request.AssociationId, cancellationToken);
            if (association == null)
            {
                return Maybe<List<FollowDto>>.None;
            }

            // Get the followers
            var followers = await _followRepository.GetFollowersByAssociationIdAsync(request.AssociationId, cancellationToken);
            
            // Get all follows for the association to have access to the follow ID and creation date
            var follows = await _context.Set<Follow>()
                .Where(f => f.AssociationId == request.AssociationId)
                .ToListAsync(cancellationToken);

            // Map to DTOs
            var followDtos = followers
                .Join(follows,
                    student => student.Id,
                    follow => follow.StudentId,
                    (student, follow) => new FollowDto(
                        follow.Id,
                        student.Id,
                        student.FirstName,
                        student.LastName,
                        student.AvatarUrl,
                        follow.CreatedAt))
                .ToList();

            return followDtos;
        }
    }
} 