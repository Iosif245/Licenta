namespace ConnectCampus.Domain.Common
{
    public class UserRole : Enumeration
    {
        public static readonly UserRole Student = new(1, "Student");
        public static readonly UserRole Association = new(2, "Association");

        public UserRole(int value, string name) : base(value, name)
        {
        }

        public static IEnumerable<UserRole> List() => [
            Student,
            Association
        ];

        public static UserRole? FromName(string? name)
        {
            return FromName<UserRole>(name);
        }

        public static UserRole? FromValue(int value)
        {
            return FromValue<UserRole>(value);
        }
    }
} 