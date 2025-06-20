using MediatR;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Abstractions.Messaging;

public interface IQuery<TResponse> : IRequest<Maybe<TResponse>>
{
} 