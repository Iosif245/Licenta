using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Associations.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Associations.Queries.GetAssociation
{
    public class GetAssociationQueryHandler : IQueryHandler<GetAssociationQuery, AssociationDto>
    {
        private readonly IAssociationRepository _associationRepository;

        public GetAssociationQueryHandler(IAssociationRepository associationRepository)
        {
            _associationRepository = associationRepository;
        }

        public async Task<Maybe<AssociationDto>> Handle(GetAssociationQuery request, CancellationToken cancellationToken)
        {
            var association = await _associationRepository.GetByIdAsync(request.Id, cancellationToken);

            if (association is null)
            {
                return Maybe<AssociationDto>.None;
            }

            var associationDto = new AssociationDto(
                association.Id,
                association.Name,
                association.Slug,
                association.Description,
                association.Logo,
                association.CoverImage,
                association.Category,
                association.FoundedYear,
                association.IsVerified,
                association.Events,
                association.UpcomingEventsCount,
                association.Followers,
                association.Location,
                association.Website,
                association.Tags,
                association.Email,
                association.Phone,
                association.Address,
                association.Facebook,
                association.Twitter,
                association.Instagram,
                association.LinkedIn,
                association.AssociationEvents.Select(e => e.Id).ToList(), // EventIds - using navigation properties
                association.Announcements.Select(a => a.Id).ToList(), // AnnouncementIds - using navigation properties
                association.CreatedAt,
                association.UpdatedAt
            );

            return associationDto;
        }
    }
} 