namespace ConnectCampus.Domain.Common.Results;

public static class MaybeExtensions
{
    public static Maybe<TResult> Map<TValue, TResult>(
        this Maybe<TValue> maybe,
        Func<TValue, TResult> map)
    {
        return !maybe.HasValue ? Maybe<TResult>.None : map(maybe.Value);
    }

    public static TResult Match<TValue, TResult>(
        this Maybe<TValue> maybe,
        Func<TValue, TResult> some,
        Func<TResult> none)
    {
        return maybe.HasValue ? some(maybe.Value) : none();
    }

    public static Maybe<TValue> Or<TValue>(
        this Maybe<TValue> maybe,
        TValue alternative)
    {
        return maybe.HasValue ? maybe : alternative;
    }

    public static Maybe<TValue> Or<TValue>(
        this Maybe<TValue> maybe,
        Func<TValue> alternative)
    {
        return maybe.HasValue ? maybe : alternative();
    }

    public static Maybe<TResult> Bind<TValue, TResult>(
        this Maybe<TValue> maybe,
        Func<TValue, Maybe<TResult>> bind)
    {
        return !maybe.HasValue ? Maybe<TResult>.None : bind(maybe.Value);
    }

    public static async Task<Maybe<TResult>> MapAsync<TValue, TResult>(
        this Task<Maybe<TValue>> maybeTask,
        Func<TValue, TResult> map)
    {
        var maybe = await maybeTask;
        return maybe.Map(map);
    }

    public static async Task<Maybe<TResult>> BindAsync<TValue, TResult>(
        this Task<Maybe<TValue>> maybeTask,
        Func<TValue, Maybe<TResult>> bind)
    {
        var maybe = await maybeTask;
        return maybe.Bind(bind);
    }

    public static async Task<Maybe<TResult>> BindAsync<TValue, TResult>(
        this Task<Maybe<TValue>> maybeTask,
        Func<TValue, Task<Maybe<TResult>>> bind)
    {
        var maybe = await maybeTask;
        return !maybe.HasValue ? Maybe<TResult>.None : await bind(maybe.Value);
    }

    public static async Task<TResult> MatchAsync<TValue, TResult>(
        this Task<Maybe<TValue>> maybeTask,
        Func<TValue, TResult> some,
        Func<TResult> none)
    {
        var maybe = await maybeTask;
        return maybe.Match(some, none);
    }

    public static Maybe<TValue> Where<TValue>(
        this Maybe<TValue> maybe,
        Func<TValue, bool> predicate)
    {
        if (!maybe.HasValue)
            return maybe;

        return predicate(maybe.Value)
            ? maybe
            : Maybe<TValue>.None;
    }

    public static async Task<Maybe<TValue>> Where<TValue>(
        this Task<Maybe<TValue>> maybeTask,
        Func<TValue, bool> predicate)
    {
        var maybe = await maybeTask;
        return maybe.Where(predicate);
    }
} 