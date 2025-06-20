namespace ConnectCampus.Domain.Common.Results;

public class Maybe<TValue> : IEquatable<Maybe<TValue>>
{
    private readonly TValue? _value;

    private Maybe(TValue? value)
    {
        _value = value;
    }

    public bool HasValue => _value is not null;
    
    public TValue Value => _value ?? throw new InvalidOperationException("Value is null");

    public static Maybe<TValue> None => new(default);

    public static Maybe<TValue> From(TValue? value) => new(value);

    public static implicit operator Maybe<TValue>(TValue? value) => From(value);

    public bool Equals(Maybe<TValue>? other)
    {
        if (other is null) return false;
        if (!HasValue && !other.HasValue) return true;
        if (HasValue != other.HasValue) return false;
        return EqualityComparer<TValue>.Default.Equals(_value!, other._value!);
    }

    public override bool Equals(object? obj)
    {
        if (obj is null) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj is Maybe<TValue> other && Equals(other);
    }

    public override int GetHashCode()
    {
        return HasValue ? _value!.GetHashCode() : 0;
    }

    public static bool operator ==(Maybe<TValue>? left, Maybe<TValue>? right)
    {
        if (left is null && right is null) return true;
        if (left is null || right is null) return false;
        return left.Equals(right);
    }

    public static bool operator !=(Maybe<TValue>? left, Maybe<TValue>? right)
        => !(left == right);
}