using MediatR;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Abstractions.Messaging;

public interface IQueryHandler<in TQuery, TResponse> : IRequestHandler<TQuery, Maybe<TResponse>>
    where TQuery : IQuery<TResponse>
{
} 