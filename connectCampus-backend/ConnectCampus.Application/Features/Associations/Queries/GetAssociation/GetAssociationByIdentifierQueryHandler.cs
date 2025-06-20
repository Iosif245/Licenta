using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Associations.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Associations.Queries.GetAssociation
{
    public class GetAssociationByIdentifierQueryHandler : IQueryHandler<GetAssociationByIdentifierQuery, AssociationDto>
    {
        private readonly IAssociationRepository _associationRepository;

        public GetAssociationByIdentifierQueryHandler(IAssociationRepository associationRepository)
        {
            _associationRepository = associationRepository;
        }

        public async Task<Maybe<AssociationDto>> Handle(GetAssociationByIdentifierQuery request, CancellationToken cancellationToken)
        {
            Association? association = null;

            // Try to parse as GUID first
            if (Guid.TryParse(request.Identifier, out var id))
            {
                association = await _associationRepository.GetByIdAsync(id, cancellationToken);
            }
            
            // If not found by ID or identifier is not a GUID, try by slug
            if (association == null)
            {
                association = await _associationRepository.GetBySlugAsync(request.Identifier, cancellationToken);
            }

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
                association.AssociationEvents.Select(e => e.Id).ToList(),
                association.Announcements.Select(a => a.Id).ToList(),
                association.CreatedAt,
                association.UpdatedAt
            );

            return associationDto;
        }
    }
} 