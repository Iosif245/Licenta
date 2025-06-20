using FluentValidation;
using MediatR;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Common.Behaviors;

public sealed class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : class
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationTasks = _validators.Select(v => v.ValidateAsync(context, cancellationToken));
        var validationResults = await Task.WhenAll(validationTasks);

        var failures = validationResults
            .Where(r => r.Errors.Any())
            .SelectMany(r => r.Errors)
            .ToList();

        if (!failures.Any())
        {
            return await next();
        }
        
        var validationDetails = failures.Select(failure => new ValidationDetail(
            PropertyName: failure.PropertyName,
            ErrorMessage: failure.ErrorMessage,
            ErrorCode: failure.ErrorCode
        )).ToList();

        var error = new Error(
            "Validation.Error",
            string.Join("\n", failures.Select(f => f.ErrorMessage)),
            ErrorType.Validation)
        {
            ValidationDetails = validationDetails
        };

        if (typeof(TResponse).IsGenericType)
        {
            var genericType = typeof(TResponse).GetGenericTypeDefinition();
            
            if (genericType == typeof(Result<>))
            {
                var resultType = typeof(TResponse).GetGenericArguments()[0];
                var result = typeof(Result<>)
                    .MakeGenericType(resultType)
                    .GetMethod(nameof(Result<object>.Failure))!
                    .Invoke(null, new object[] { error });

                return (TResponse)result!;
            }
        }

        if (typeof(TResponse) == typeof(Result))
        {
            return (TResponse)(object)Result.Failure(error);
        }

        throw new ValidationException(failures);
    }
} 