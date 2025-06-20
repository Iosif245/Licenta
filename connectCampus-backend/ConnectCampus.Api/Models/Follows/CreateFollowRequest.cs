using System;

namespace ConnectCampus.Api.Models.Follows
{
    /// <summary>
    /// Request to follow an association
    /// </summary>
    public record CreateFollowRequest(
        Guid StudentId,
        Guid AssociationId
    );
} 