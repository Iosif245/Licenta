using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Associations.Commands.DeleteAssociation
{
    public record DeleteAssociationCommand(Guid Id) : ICommand<bool>;
} 