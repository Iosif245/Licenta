using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Api.Extensions;

public static class ResultExtensions
{
    public static T Match<T>(this Result result, Func<T> onSuccess, Func<Result, T> onFailure)
    {
        return result.IsSuccess ? onSuccess() : onFailure(result);
    }

    public static TOut Match<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, TOut> onSuccess,
        Func<Result<TIn>, TOut> onFailure)
    {
        return result.IsSuccess ? onSuccess(result.Value) : onFailure(result);
    }
    
    public static TOut Match<TIn, TOut>(
        this Maybe<TIn> maybe,
        Func<TIn, TOut> onSuccess,
        Func<TOut> onFailure)
    {
        return maybe.HasValue ? onSuccess(maybe.Value) : onFailure();
    }
} 