using ConnectCampus.Application.Abstractions.Messaging;
 
namespace ConnectCampus.Application.Features.Events.Queries.CheckEventRegistrationStatus
{
    public record CheckEventRegistrationStatusQuery(Guid StudentId, Guid EventId) : IQuery<bool>;
} 