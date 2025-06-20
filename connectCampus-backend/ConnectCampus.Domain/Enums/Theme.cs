using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Enums
{
    public class Theme : Enumeration
    {
        public static readonly Theme System = new(1, "System");
        public static readonly Theme Light = new(2, "Light");
        public static readonly Theme Dark = new(3, "Dark");

        public Theme(int value, string name) : base(value, name)
        {
        }

        public static IEnumerable<Theme> List() => [
            System,
            Light,
            Dark
        ];

        public static Theme? FromName(string? name)
        {
            return FromName<Theme>(name);
        }

        public static Theme? FromValue(int value)
        {
            return FromValue<Theme>(value);
        }
    }
} 