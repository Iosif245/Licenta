using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Associations.Dtos;

namespace ConnectCampus.Application.Features.Associations.Queries.GetAssociation
{
    public record GetAssociationBySlugQuery(string Slug) : IQuery<AssociationDto>;
} 