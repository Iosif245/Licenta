using MediatR;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Abstractions.Messaging;

public interface ICommand : IRequest<Result>
{
}

public interface ICommand<TResponse> : IRequest<Result<TResponse>>
{
} 