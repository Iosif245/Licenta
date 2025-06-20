using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Associations.Dtos;

namespace ConnectCampus.Application.Features.Associations.Queries.GetAssociation
{
    public record GetAssociationByIdentifierQuery(string Identifier) : IQuery<AssociationDto>;
} 