namespace ConnectCampus.Domain.Common.Results;

public static class ResultExtensions
{
    public static Result<TOut> Map<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, TOut> map)
    {
        return result.IsSuccess
            ? Result.Success(map(result.Value))
            : Result.Failure<TOut>(result.Error);
    }

    public static async Task<Result<TOut>> Map<TIn, TOut>(
        this Task<Result<TIn>> resultTask,
        Func<TIn, TOut> map)
    {
        var result = await resultTask;
        return result.Map(map);
    }

    public static Result<TOut> Bind<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, Result<TOut>> bind)
    {
        return result.IsSuccess
            ? bind(result.Value)
            : Result.Failure<TOut>(result.Error);
    }

    public static async Task<Result<TOut>> Bind<TIn, TOut>(
        this Task<Result<TIn>> resultTask,
        Func<TIn, Result<TOut>> bind)
    {
        var result = await resultTask;
        return result.Bind(bind);
    }

    public static async Task<Result<TOut>> Bind<TIn, TOut>(
        this Task<Result<TIn>> resultTask,
        Func<TIn, Task<Result<TOut>>> bind)
    {
        var result = await resultTask;
        return result.IsSuccess
            ? await bind(result.Value)
            : Result.Failure<TOut>(result.Error);
    }

    public static Result<TValue> Ensure<TValue>(
        this Result<TValue> result,
        Func<TValue, bool> predicate,
        Error error)
    {
        if (result.IsFailure)
        {
            return result;
        }

        return predicate(result.Value)
            ? result
            : Result.Failure<TValue>(error);
    }

    public static Result<TValue> Tap<TValue>(
        this Result<TValue> result,
        Action<TValue> action)
    {
        if (result.IsSuccess)
        {
            action(result.Value);
        }

        return result;
    }

    public static async Task<Result<TValue>> Tap<TValue>(
        this Result<TValue> result,
        Func<TValue, Task> action)
    {
        if (result.IsSuccess)
        {
            await action(result.Value);
        }

        return result;
    }

    public static Result<TValue> TapError<TValue>(
        this Result<TValue> result,
        Action<Error> action)
    {
        if (result.IsFailure)
        {
            action(result.Error);
        }

        return result;
    }

    public static async Task<Result<TValue>> TapError<TValue>(
        this Result<TValue> result,
        Func<Error, Task> action)
    {
        if (result.IsFailure)
        {
            await action(result.Error);
        }

        return result;
    }
} 