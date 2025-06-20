using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Associations.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Associations.Queries.ListAssociations
{
    public class ListAssociationsQueryHandler : IQueryHandler<ListAssociationsQuery, object>
    {
        private readonly IAssociationRepository _associationRepository;

        public ListAssociationsQueryHandler(IAssociationRepository associationRepository)
        {
            _associationRepository = associationRepository;
        }

        public async Task<Maybe<object>> Handle(ListAssociationsQuery request, CancellationToken cancellationToken)
        {
            // If no pagination params provided, return simple list for backward compatibility
            if (request.PaginationParams == null)
            {
                var allAssociations = await _associationRepository.ListAsync(cancellationToken);
                var simpleDtos = allAssociations.Select(MapToDto).ToList();
                return simpleDtos;
            }

            // Use pagination
            PagedList<Domain.Entities.Association> pagedAssociations;
            
            if (!string.IsNullOrEmpty(request.Category))
            {
                pagedAssociations = await _associationRepository.ListByCategoryPagedAsync(
                    request.Category, request.PaginationParams, cancellationToken);
            }
            else
            {
                pagedAssociations = await _associationRepository.ListPagedAsync(
                    request.PaginationParams, cancellationToken);
            }

            var pagedDtos = new PagedAssociationsDto(
                pagedAssociations.Items.Select(MapToDto).ToList(),
                pagedAssociations.PageNumber,
                pagedAssociations.PageSize,
                pagedAssociations.TotalCount,
                pagedAssociations.TotalPages,
                pagedAssociations.HasPreviousPage,
                pagedAssociations.HasNextPage
            );

            return pagedDtos;
        }

        private static AssociationSummaryDto MapToDto(Domain.Entities.Association association)
        {
            return new AssociationSummaryDto(
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
                association.CreatedAt,
                association.UpdatedAt
            );
        }
    }

    // Handler for simple query (backward compatibility)
    public class ListAssociationsSimpleQueryHandler : IQueryHandler<ListAssociationsSimpleQuery, List<AssociationSummaryDto>>
    {
        private readonly IAssociationRepository _associationRepository;

        public ListAssociationsSimpleQueryHandler(IAssociationRepository associationRepository)
        {
            _associationRepository = associationRepository;
        }

        public async Task<Maybe<List<AssociationSummaryDto>>> Handle(ListAssociationsSimpleQuery request, CancellationToken cancellationToken)
        {
            var associations = await _associationRepository.ListAsync(cancellationToken);

            var associationDtos = associations.Select(a => new AssociationSummaryDto(
                a.Id,
                a.Name,
                a.Slug,
                a.Description,
                a.Logo,
                a.CoverImage,
                a.Category,
                a.FoundedYear,
                a.IsVerified,
                a.Events,
                a.UpcomingEventsCount,
                a.Followers,
                a.Location,
                a.Website,
                a.Tags,
                a.CreatedAt,
                a.UpdatedAt
            )).ToList();

            return associationDtos;
        }
    }
} 