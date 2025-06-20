using ConnectCampus.Application.Abstractions.Messaging;
 
namespace ConnectCampus.Application.Features.Events.Queries.CheckEventFavoriteStatus
{
    public record CheckEventFavoriteStatusQuery(Guid StudentId, Guid EventId) : IQuery<bool>;
} 