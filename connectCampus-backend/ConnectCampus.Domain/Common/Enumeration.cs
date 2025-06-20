using System.Reflection;

namespace ConnectCampus.Domain.Common
{
    public abstract class Enumeration : IComparable
    {
        public string Name { get; private set; }
        public int Value { get; private set; }

        protected Enumeration(int value, string name)
        {
            Value = value;
            Name = name;
        }

        public override string ToString() => Name;

        public static IEnumerable<T> GetAll<T>() where T : Enumeration
        {
            var fields = typeof(T).GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly);
            
            return fields.Select(f => f.GetValue(null)).Cast<T>();
        }

        public override bool Equals(object? obj)
        {
            if (obj is not Enumeration otherValue)
            {
                return false;
            }

            var typeMatches = GetType() == obj.GetType();
            var valueMatches = Value.Equals(otherValue.Value);

            return typeMatches && valueMatches;
        }

        public override int GetHashCode() => Value.GetHashCode();

        public static T? FromValue<T>(int value) where T : Enumeration
        {
            var matchingItem = Parse<T, int>(value, "value", item => item.Value == value);
            return matchingItem;
        }

        public static T? FromName<T>(string? name) where T : Enumeration
        {
            var matchingItem = Parse<T, string>(name, "name", item => item.Name == name);
            return matchingItem;
        }

        private static T Parse<T, K>(K? value, string description, Func<T, bool> predicate) where T : Enumeration
        {
            var matchingItem = GetAll<T>().FirstOrDefault(predicate);

            if (matchingItem == null)
                throw new InvalidOperationException($"'{value}' is not a valid {description} in {typeof(T)}");

            return matchingItem;
        }

        public int CompareTo(object? other) => Value.CompareTo(((Enumeration)other!).Value);
    }
} 