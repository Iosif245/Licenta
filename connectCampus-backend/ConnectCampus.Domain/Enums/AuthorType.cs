using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Enums
{
    public class AuthorType : Enumeration
    {
        public static readonly AuthorType Student = new(1, "Student");
        public static readonly AuthorType Association = new(2, "Association");

        public AuthorType(int id, string name) : base(id, name)
        {
        }

        public static IEnumerable<AuthorType> List() => [
            Student,
            Association
        ];

        public static AuthorType? FromName(string? name)
        {
            return FromName<AuthorType>(name);
        }

        public static AuthorType? FromValue(int value)
        {
            return FromValue<AuthorType>(value);
        }
    }
} 